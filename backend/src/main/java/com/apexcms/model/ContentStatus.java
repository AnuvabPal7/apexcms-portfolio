package com.apexcms.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Draft items are only visible to the admin; published items are public. JSON uses lowercase ("draft"/"published"). */
public enum ContentStatus {
    DRAFT, PUBLISHED;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static ContentStatus fromJson(String value) {
        return valueOf(value.trim().toUpperCase());
    }
}
