package com.template.controller;

import com.template.common.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/uploads")
@RequiredArgsConstructor
public class PublicFileController {

    private final FileStorageService fileStorageService;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource resource = fileStorageService.loadAsResource(filename);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }
        MediaType mediaType = MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
            .contentType(mediaType)
            .header(HttpHeaders.CACHE_CONTROL, "public, max-age=604800")
            .body(resource);
    }
}
