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
            'settings' => Setting::all()->groupBy('group'),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($data['settings'] as $settingData) {
            Setting::where('key', $settingData['key'])->update(['value' => $settingData['value']]);
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
