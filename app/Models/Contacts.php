<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Contacts extends Model
{
     use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'message',
        'status',
        'replied_at',
        'reply_message',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    public function markAsRead()
    {
        $this->update(['status' => 'read']);
    }

    public function markAsReplied($replyMessage = null)
    {
        $this->update([
            'status' => 'replied',
            'replied_at' => now(),
            'reply_message' => $replyMessage,
        ]);
    }

    public function scopeUnread($query)
    {
        return $query->where('status', 'unread');
    }

    public function scopeRead($query)
    {
        return $query->where('status', 'read');
    }

    public function scopeReplied($query)
    {
        return $query->where('status', 'replied');
    }
}
