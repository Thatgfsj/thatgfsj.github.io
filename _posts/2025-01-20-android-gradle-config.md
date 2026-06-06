---
layout: post
title: "Android 开发：Gradle 构建配置最佳实践"
date: 2025-01-20 10:30:00 +0800
tags: [Android, Gradle]
---

Android 项目使用 Gradle 构建，良好的构建配置能显著提升开发效率。

## 版本目录（Version Catalog）

使用 `libs.versions.toml` 统一管理依赖版本：

```toml
[versions]
agp = "8.7.3"
kotlin = "2.0.21"
compose-bom = "2024.12.01"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version = "1.15.0" }
androidx-lifecycle-runtime = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version = "2.8.7" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
```

## 构建变体（Build Variants）

根据不同环境配置：

```groovy
android {
    buildTypes {
        debug {
            applicationIdSuffix ".debug"
            versionNameSuffix "-debug"
        }
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
        }
    }
}
```

## 总结

好的构建配置 = 可维护的依赖管理 + 清晰的变体策略 + 合理的构建优化。
