package com.template.config;

import com.template.common.storage.FileStorageProperties;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class FileResourceConfig implements WebMvcConfigurer {

    private final FileStorageProperties fileStorageProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path storagePath = Paths.get(fileStorageProperties.getLocation()).toAbsolutePath().normalize();
        String locationUri = storagePath.toUri().toString();
        registry.addResourceHandler("/public/uploads/**")
            .addResourceLocations(locationUri)
            .setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());
    }
}
