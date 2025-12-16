package com.template.common.storage.impl;

import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.storage.FileStorageProperties;
import com.template.common.storage.FileStorageService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocalFileStorageService implements FileStorageService {

    private static final Pattern DATA_URI_PATTERN = Pattern.compile("^data:(.+?);base64,(.+)$", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss", Locale.ROOT);

    private final FileStorageProperties properties;

    private Path rootPath;

    private Path getRootPath() {
        if (rootPath == null) {
            rootPath = Paths.get(properties.getLocation()).toAbsolutePath().normalize();
            try {
                Files.createDirectories(rootPath);
            } catch (IOException ex) {
                log.error("Failed to create storage directory {}", rootPath, ex);
                throw new BusinessException(ErrorCode.INTERNAL_ERROR, "无法创建文件存储目录: " + rootPath);
            }
        }
        return rootPath;
    }

    @Override
    public String ensureAccessibleUrl(String source) {
        if (!StringUtils.hasText(source)) {
            return source;
        }
        if (isPublicUrl(source)) {
            return source;
        }
        Matcher matcher = DATA_URI_PATTERN.matcher(source.trim());
        if (!matcher.matches()) {
            return source;
        }
        String mimeType = matcher.group(1);
        String base64Data = matcher.group(2).replaceAll("\\s+", "");
        byte[] data;
        try {
            data = Base64.getDecoder().decode(base64Data);
        } catch (IllegalArgumentException ex) {
            log.error("Invalid base64 image data", ex);
            throw new BusinessException(ErrorCode.BAD_REQUEST, "图片Base64数据不合法");
        }
        String extension = resolveExtension(mimeType);
        String filename = generateFilename(extension);
        Path target = getRootPath().resolve(filename).normalize();
        try {
            Files.createDirectories(target.getParent());
            Files.write(target, data, StandardOpenOption.CREATE_NEW);
        } catch (IOException ex) {
            log.error("Failed to save image {}", filename, ex);
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "保存图片失败");
        }
        return buildPublicUrl(filename);
    }

    private boolean isPublicUrl(String url) {
        String trimmed = url.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return true;
        }
        return StringUtils.hasText(properties.getBaseUrl()) && trimmed.startsWith(properties.getBaseUrl());
    }

    private String buildPublicUrl(String filename) {
        String base = properties.getBaseUrl();
        if (!StringUtils.hasText(base)) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "file.storage.base-url 未配置");
        }
        base = base.endsWith("/") ? base.substring(0, base.length() - 1) : base;
        return base + "/" + filename;
    }

    private String generateFilename(String extension) {
        String timestamp = DATE_FORMAT.format(LocalDateTime.now());
        return timestamp + "_" + UUID.randomUUID().toString().replaceAll("-", "") + extension;
    }

    private String resolveExtension(String mimeType) {
        if (!StringUtils.hasText(mimeType)) {
            return ".bin";
        }
        String lower = mimeType.toLowerCase(Locale.ROOT);
        if (lower.contains("png")) {
            return ".png";
        }
        if (lower.contains("jpeg") || lower.contains("jpg")) {
            return ".jpg";
        }
        if (lower.contains("webp")) {
            return ".webp";
        }
        if (lower.contains("gif")) {
            return ".gif";
        }
        return ".bin";
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = getRootPath().resolve(filename).normalize();
            if (!Files.exists(file) || !Files.isReadable(file)) {
                return null;
            }
            return new UrlResource(file.toUri());
        } catch (IOException ex) {
            log.error("Failed to load stored file {}", filename, ex);
            return null;
        }
    }
}
