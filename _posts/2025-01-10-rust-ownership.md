---
layout: post
title: "Rust 学习笔记：所有权与借用"
date: 2025-01-10 14:00:00 +0800
tags: [Rust, 编程]
---

Rust 的所有权（Ownership）系统是其最独特也最重要的特性。这篇笔记记录一些核心概念。

## 所有权规则

1. Rust 中每一个值都有一个 **所有者**（owner）
2. 同一时间只能有一个所有者
3. 当所有者离开作用域，值将被丢弃

## 借用

```rust
fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);  // 借用，s 仍有效
    println!("'{}' 的长度是 {}", s, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

## 可变引用

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

> **注意**：同一作用域中，不能同时拥有多个可变引用，也不能同时拥有可变引用和不可变引用。

## 总结

所有权系统让 Rust 无需垃圾回收器就能保证内存安全。虽然初学时需要适应，但一旦掌握，会发现它极大地减少了运行时错误的可能。
