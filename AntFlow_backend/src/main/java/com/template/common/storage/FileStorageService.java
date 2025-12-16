package com.template.common.storage;

import org.springframework.core.io.Resource;

public interface FileStorageService {

    /**
     * Ensure the provided image reference is accessible via HTTP URL.
     * If a base64 data URI is provided it will be stored locally and the public URL returned.
     */
    String ensureAccessibleUrl(String source);

    /**
     * Load stored file as Spring Resource.
     */
    Resource loadAsResource(String filename);
}
