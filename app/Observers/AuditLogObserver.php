<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditLogObserver
{
    public function created(Model $model): void
    {
        $this->log($model, 'created', [
            'after' => $this->filtered($model->getAttributes()),
        ]);
    }

    public function updated(Model $model): void
    {
        $changes = $model->getChanges();

        unset($changes['updated_at'], $changes['created_at']);

        if (empty($changes)) return;

        $before = [];
        $after  = [];

        foreach ($changes as $key => $newValue) {
            $before[$key] = $model->getOriginal($key);
            $after[$key]  = $newValue;
        }

        $this->log($model, 'updated', [
            'before' => $this->filtered($before),
            'after'  => $this->filtered($after),
        ]);
    }

    public function deleted(Model $model): void
    {
        $this->log($model, 'deleted', [
            'before' => $this->filtered($model->getOriginal()),
        ]);
    }

    public function restored(Model $model): void
    {
        $this->log($model, 'restored', [
            'after' => $this->filtered($model->getAttributes()),
        ]);
    }

    private function log(Model $model, string $action, ?array $changes = null): void
    {
        if ($model instanceof AuditLog) return;

        $request = request();

        AuditLog::create([
            'user_id'           => Auth::id(), 
            'action'            => $action,
            'auditable_type'    => get_class($model),
            'auditable_id'      => $model->getKey(),
            'metadata'          => $changes,
            'ip_address'        => $request?->ip(),
            'user_agent'        => $request?->userAgent()
        ]);
    }

    private function filtered(array $data): array
    {
        unset(
            $data['password'],
            $data['remember_token']
        );

        return $data;
    }
}