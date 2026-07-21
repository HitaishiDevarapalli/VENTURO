package com.venturo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String city;

    private String area;

    private Double latitude;

    private Double longitude;

    @Builder.Default
    @Column(name = "views_count", nullable = false)
    private Long viewsCount = 0L;

    @Builder.Default
    @Column(name = "unique_visitors_count", nullable = false)
    private Long uniqueVisitorsCount = 0L;

    @Column(name = "last_viewed_at")
    private LocalDateTime lastViewedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_visitor_ips", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "visitor_ip")
    @Builder.Default
    private Set<String> visitorIps = new HashSet<>();
}
