package com.template.common.storage;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "file.storage")
public class FileStorageProperties {

    /**
     * Publicly accessible base URL, e.g. https://example.com/public/files
     */
    private String baseUrl = "http://localhost:8080/public/uploads";

    /**
     * Local directory for storing files.
     */
    private String location = "storage/uploads";
}
