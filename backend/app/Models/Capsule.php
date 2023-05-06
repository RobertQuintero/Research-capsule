<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capsule extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function reviews(){
        return $this->hasMany(Review::class, 'capsule_id');
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
