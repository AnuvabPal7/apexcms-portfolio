package com.apexcms.controller;

import com.apexcms.exception.ResourceNotFoundException;
import com.apexcms.model.BaseContent;
import com.apexcms.model.ContentStatus;
import com.apexcms.repository.ContentRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Generic CRUD shared by skills, projects, blogs, experience, testimonials and services.
 * - GET is public, but anonymous visitors only see PUBLISHED items; a logged-in admin sees drafts too.
 * - POST / PUT / DELETE require a valid JWT (enforced in SecurityConfig).
 */
public abstract class ContentController<T extends BaseContent> {

    private final ContentRepository<T> repository;

    protected ContentController(ContentRepository<T> repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<T> list() {
        return isAdmin()
                ? repository.findAllByOrderByDisplayOrderAsc()
                : repository.findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED);
    }

    @GetMapping("/{id}")
    public T get(@PathVariable("id") Long id) {
        T item = findOrThrow(id);
        if (!isAdmin() && item.getStatus() != ContentStatus.PUBLISHED) {
            throw new ResourceNotFoundException("Item " + id + " not found");
        }
        return item;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public T create(@Valid @RequestBody T body) {
        body.setId(null); // never trust an id sent by the client on create
        return repository.save(body);
    }

    @PutMapping("/{id}")
    public T update(@PathVariable("id") Long id, @Valid @RequestBody T body) {
        findOrThrow(id);
        body.setId(id);
        return repository.save(body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        repository.delete(findOrThrow(id));
    }

    private T findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item " + id + " not found"));
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }
}
