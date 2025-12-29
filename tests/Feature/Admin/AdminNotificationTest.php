<?php

use App\Mail\AdminNotificationMail;
use App\Models\AdminNotification;
use App\Models\Order;
use App\Models\User;
use App\Services\AdminNotificationService;
use Illuminate\Support\Facades\Mail;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('notification is created when new order is placed', function () {
    $order = Order::factory()->create([
        'customer_name' => 'John Doe',
        'total' => 150000,
    ]);

    $service = new AdminNotificationService;
    $notification = $service->notifyNewOrder($order);

    expect($notification)->toBeInstanceOf(AdminNotification::class);
    expect($notification->type)->toBe(AdminNotification::TYPE_NEW_ORDER);
    expect($notification->title)->toBe('Pesanan Baru');
    expect($notification->data['order_id'])->toBe($order->id);
    expect($notification->data['customer_name'])->toBe('John Doe');
    expect($notification->read_at)->toBeNull();

    $this->assertDatabaseHas('admin_notifications', [
        'id' => $notification->id,
        'type' => 'new_order',
    ]);
});

test('notification is created when cancellation is requested', function () {
    $order = Order::factory()->create([
        'customer_name' => 'Jane Doe',
        'cancellation_reason' => 'Changed my mind',
    ]);

    $service = new AdminNotificationService;
    $notification = $service->notifyCancellationRequest($order);

    expect($notification)->toBeInstanceOf(AdminNotification::class);
    expect($notification->type)->toBe(AdminNotification::TYPE_CANCELLATION_REQUEST);
    expect($notification->title)->toBe('Permintaan Pembatalan');
    expect($notification->data['order_id'])->toBe($order->id);
    expect($notification->data['cancellation_reason'])->toBe('Changed my mind');
    expect($notification->read_at)->toBeNull();
});

test('notification index requires authentication', function () {
    $response = $this->get(route('admin.notifications.index'));

    $response->assertRedirect(route('login'));
});

test('can get notifications list', function () {
    $user = User::factory()->create();

    AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Test Notification',
        'message' => 'Test message',
        'data' => ['order_id' => 'test-123'],
    ]);

    AdminNotification::create([
        'type' => 'cancellation_request',
        'title' => 'Test Cancellation',
        'message' => 'Test cancellation message',
        'data' => ['order_id' => 'test-456'],
    ]);

    $response = $this->actingAs($user)
        ->getJson(route('admin.notifications.index'));

    $response->assertOk()
        ->assertJsonCount(2, 'notifications')
        ->assertJsonPath('unread_count', 2);
});

test('can get unread notification count', function () {
    $user = User::factory()->create();

    AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Unread 1',
        'message' => 'Message 1',
    ]);

    AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Unread 2',
        'message' => 'Message 2',
    ]);

    AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Read 1',
        'message' => 'Message 3',
        'read_at' => now(),
    ]);

    $response = $this->actingAs($user)
        ->getJson(route('admin.notifications.count'));

    $response->assertOk()
        ->assertJsonPath('count', 2);
});

test('can mark notification as read', function () {
    $user = User::factory()->create();

    $notification = AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Test',
        'message' => 'Test message',
    ]);

    expect($notification->read_at)->toBeNull();

    $response = $this->actingAs($user)
        ->postJson(route('admin.notifications.mark-read', $notification));

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('unread_count', 0);

    $notification->refresh();
    expect($notification->read_at)->not->toBeNull();
});

test('can mark all notifications as read', function () {
    $user = User::factory()->create();

    AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Test 1',
        'message' => 'Message 1',
    ]);

    AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Test 2',
        'message' => 'Message 2',
    ]);

    expect(AdminNotification::unread()->count())->toBe(2);

    $response = $this->actingAs($user)
        ->post(route('admin.notifications.mark-all-read'));

    $response->assertRedirect();

    expect(AdminNotification::unread()->count())->toBe(0);
    expect(AdminNotification::read()->count())->toBe(2);
});

test('notification model has correct scopes', function () {
    AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Unread',
        'message' => 'Unread message',
    ]);

    AdminNotification::create([
        'type' => 'cancellation_request',
        'title' => 'Read',
        'message' => 'Read message',
        'read_at' => now(),
    ]);

    expect(AdminNotification::unread()->count())->toBe(1);
    expect(AdminNotification::read()->count())->toBe(1);
    expect(AdminNotification::byType('new_order')->count())->toBe(1);
    expect(AdminNotification::byType('cancellation_request')->count())->toBe(1);
});

test('notification can mark itself as read', function () {
    $notification = AdminNotification::create([
        'type' => 'new_order',
        'title' => 'Test',
        'message' => 'Test message',
    ]);

    expect($notification->isRead())->toBeFalse();

    $notification->markAsRead();

    expect($notification->isRead())->toBeTrue();
    expect($notification->read_at)->not->toBeNull();
});

test('checkout creates admin notification for new order', function () {
    // Create a product with stock
    $product = \App\Models\Product::factory()->create([
        'price' => 50000,
        'stock' => 10,
    ]);

    $response = $this->post(route('checkout.store'), [
        'customer_name' => 'Test Customer',
        'customer_email' => 'test@example.com',
        'customer_phone' => '081234567890',
        'customer_address' => 'Test Address',
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('admin_notifications', [
        'type' => 'new_order',
    ]);
});

test('email is sent when new order notification is created', function () {
    Mail::fake();

    config(['mail.admin_email' => 'admin@example.com']);

    $order = Order::factory()->create([
        'customer_name' => 'Test Customer',
        'total' => 100000,
    ]);

    $service = new AdminNotificationService;
    $service->notifyNewOrder($order);

    Mail::assertQueued(AdminNotificationMail::class, function ($mail) {
        return $mail->hasTo('admin@example.com');
    });
});

test('email is sent when cancellation request notification is created', function () {
    Mail::fake();

    config(['mail.admin_email' => 'admin@example.com']);

    $order = Order::factory()->create([
        'customer_name' => 'Test Customer',
        'cancellation_reason' => 'Out of stock',
    ]);

    $service = new AdminNotificationService;
    $service->notifyCancellationRequest($order);

    Mail::assertQueued(AdminNotificationMail::class, function ($mail) {
        return $mail->hasTo('admin@example.com');
    });
});

test('email is not sent when admin email is not configured', function () {
    Mail::fake();

    config(['mail.admin_email' => null]);

    $order = Order::factory()->create([
        'customer_name' => 'Test Customer',
        'total' => 100000,
    ]);

    $service = new AdminNotificationService;
    $service->notifyNewOrder($order);

    Mail::assertNothingQueued();
});

test('admin notification mail has correct content', function () {
    $notification = AdminNotification::create([
        'type' => AdminNotification::TYPE_NEW_ORDER,
        'title' => 'Pesanan Baru',
        'message' => 'Pesanan baru ORD-001 dari John Doe sebesar Rp 150.000',
        'data' => [
            'order_id' => 'test-uuid',
            'order_number' => 'ORD-001',
            'customer_name' => 'John Doe',
            'total' => 150000,
        ],
    ]);

    $mail = new AdminNotificationMail($notification);

    expect($mail->notification->title)->toBe('Pesanan Baru');
    expect($mail->notification->type)->toBe(AdminNotification::TYPE_NEW_ORDER);
});
