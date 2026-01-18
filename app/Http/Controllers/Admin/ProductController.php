<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\MediaCompressionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        private MediaCompressionService $mediaService
    ) {}

    public function index(Request $request)
    {
        $limit = $request->input('limit', 10);

        $query = Product::with('category', 'media')->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('description', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $products = $query->paginate($limit)
            ->withQueryString();

        $categories = Category::where('is_active', true)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id', 'is_active', 'limit']),
        ]);
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        if ($request->has('new_media')) {
            foreach ($request->input('new_media') as $index => $mediaMeta) {
                if ($request->hasFile("new_media.{$index}.file")) {
                    $file = $request->file("new_media.{$index}.file");
                    $isImage = $mediaMeta['type'] === 'image';

                    // Compress and store (handles both Cloudinary and local storage)
                    if ($isImage && $this->mediaService->shouldCompress($file)) {
                        $result = $this->mediaService->compressAndStore($file, 'products');
                    } elseif (! $isImage && $this->mediaService->shouldCompressVideo($file)) {
                        $result = $this->mediaService->compressAndStoreVideo($file, 'products');
                    } else {
                        $path = $this->mediaService->storeWithoutCompression($file, 'products');
                        $result = ['path' => $path, 'thumbnail_path' => null];
                    }

                    $product->media()->create([
                        'path' => $result['path'],
                        'thumbnail_path' => $result['thumbnail_path'],
                        'type' => $mediaMeta['type'],
                        'is_primary' => filter_var($mediaMeta['is_primary'] ?? false, FILTER_VALIDATE_BOOLEAN),
                        'sort_order' => $index,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dibuat.');
    }

    public function show(Product $product)
    {
        $product->load(['media', 'category']);

        return Inertia::render('admin/products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {
        $product->load('media');
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        // Handle Deleted Media
        if ($request->has('deleted_media')) {
            foreach ($request->input('deleted_media') as $mediaId) {
                $media = $product->media()->find($mediaId);
                if ($media) {
                    $this->mediaService->deleteMedia($media->path, $media->thumbnail_path);
                    $media->delete();
                }
            }
        }

        // Handle New Media
        if ($request->has('new_media')) {
            $currentMaxSort = $product->media()->max('sort_order') ?? -1;

            foreach ($request->input('new_media') as $index => $mediaMeta) {
                if ($request->hasFile("new_media.{$index}.file")) {
                    $file = $request->file("new_media.{$index}.file");
                    $isImage = $mediaMeta['type'] === 'image';

                    // Compress and store (handles both Cloudinary and local storage)
                    if ($isImage && $this->mediaService->shouldCompress($file)) {
                        $result = $this->mediaService->compressAndStore($file, 'products');
                    } elseif (! $isImage && $this->mediaService->shouldCompressVideo($file)) {
                        $result = $this->mediaService->compressAndStoreVideo($file, 'products');
                    } else {
                        $path = $this->mediaService->storeWithoutCompression($file, 'products');
                        $result = ['path' => $path, 'thumbnail_path' => null];
                    }

                    $product->media()->create([
                        'path' => $result['path'],
                        'thumbnail_path' => $result['thumbnail_path'],
                        'type' => $mediaMeta['type'],
                        'is_primary' => filter_var($mediaMeta['is_primary'] ?? false, FILTER_VALIDATE_BOOLEAN),
                        'sort_order' => $currentMaxSort + 1 + $index,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        foreach ($product->media as $media) {
            $this->mediaService->deleteMedia($media->path, $media->thumbnail_path);
        }
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus.');
    }
}
