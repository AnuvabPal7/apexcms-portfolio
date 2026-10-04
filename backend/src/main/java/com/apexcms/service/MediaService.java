package com.apexcms.service;

import com.apexcms.config.AppProperties;
import com.apexcms.exception.BadRequestException;
import com.apexcms.exception.ResourceNotFoundException;
import com.apexcms.model.MediaAsset;
import com.apexcms.repository.MediaRepository;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MediaService {
    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp",
            "image/gif", "gif");

    private final Path uploadDir;
    private final MediaRepository repository;

    public MediaService(AppProperties props, MediaRepository repository) {
        this.uploadDir = Path.of(props.upload().dir()).toAbsolutePath().normalize();
        this.repository = repository;
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not create upload directory " + uploadDir, e);
        }
    }

    public MediaAsset storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file uploaded");
        }
        String contentType = file.getContentType();
        String extension = contentType == null ? null : ALLOWED_TYPES.get(contentType);
        if (extension == null) {
            throw new BadRequestException("Only JPEG, PNG, WebP and GIF images are allowed");
        }
        // The Content-Type header is sent by the client, so also check the file's real signature (magic bytes).
        if (!hasImageSignature(file, extension)) {
            throw new BadRequestException("File content does not match an image of type " + contentType);
        }

        // Never use the user's filename on disk: it could contain "../" or overwrite another file.
        String storedName = UUID.randomUUID() + "." + extension;
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, uploadDir.resolve(storedName));
        } catch (IOException e) {
            throw new UncheckedIOException("Could not save file", e);
        }

        MediaAsset asset = new MediaAsset();
        asset.setFileName(storedName);
        asset.setOriginalName(file.getOriginalFilename());
        asset.setUrl("/uploads/" + storedName);
        asset.setSize(file.getSize());
        asset.setMimeType(contentType);
        return repository.save(asset);
    }

    public List<MediaAsset> list() {
        return repository.findAllByOrderByUploadedAtDesc();
    }

    public void delete(Long id) {
        MediaAsset asset = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media " + id + " not found"));
        try {
            Files.deleteIfExists(uploadDir.resolve(asset.getFileName()));
        } catch (IOException e) {
            throw new UncheckedIOException("Could not delete file", e);
        }
        repository.delete(asset);
    }

    private boolean hasImageSignature(MultipartFile file, String extension) {
        try (InputStream in = file.getInputStream()) {
            byte[] head = in.readNBytes(12);
            return switch (extension) {
                case "jpg" -> head.length >= 3 && (head[0] & 0xFF) == 0xFF && (head[1] & 0xFF) == 0xD8 && (head[2] & 0xFF) == 0xFF;
                case "png" -> head.length >= 4 && (head[0] & 0xFF) == 0x89 && head[1] == 'P' && head[2] == 'N' && head[3] == 'G';
                case "gif" -> head.length >= 4 && new String(head, 0, 4, StandardCharsets.US_ASCII).equals("GIF8");
                case "webp" -> head.length >= 12
                        && new String(Arrays.copyOfRange(head, 0, 4), StandardCharsets.US_ASCII).equals("RIFF")
                        && new String(Arrays.copyOfRange(head, 8, 12), StandardCharsets.US_ASCII).equals("WEBP");
                default -> false;
            };
        } catch (IOException e) {
            return false;
        }
    }
}
