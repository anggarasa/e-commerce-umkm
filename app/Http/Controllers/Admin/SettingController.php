<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Setting;

use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/settings/index', [
            'groupedSettings' => Setting::all()->groupBy('group'),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($data['settings'] as $index => $settingData) {
            $key = $settingData['key'];
            $value = $settingData['value'];

            if ($key === 'store_logo' && $request->hasFile("settings.{$index}.value")) {
                $path = $request->file("settings.{$index}.value")->store('settings', 'public');
                $value = '/storage/' . $path;
            }

            Setting::where('key', $key)->update(['value' => $value]);
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
