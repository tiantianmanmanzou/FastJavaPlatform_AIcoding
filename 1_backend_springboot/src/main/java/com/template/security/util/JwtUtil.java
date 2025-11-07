package com.template.security.util;

import com.template.common.constants.CommonConstants;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.token-prefix}")
    private String tokenPrefix;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String username, Collection<String> roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        return Jwts.builder()
            .issuedAt(now)
            .expiration(expiryDate)
            .subject(username)
            .claim("uid", userId)
            .claim("roles", roles)
            .signWith(signingKey)
            .compact();
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN, ErrorCode.INVALID_TOKEN.getMessage());
        }
    }

    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        String username = claims.getSubject();
        List<String> roles = claims.get("roles", List.class);
        List<SimpleGrantedAuthority> authorities = roles == null
            ? Collections.emptyList()
            : roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(username, "", authorities);
        authentication.setDetails(claims);
        return authentication;
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (BusinessException ex) {
            return false;
        }
    }

    public String resolveToken(HttpServletRequest request) {
        String header = request.getHeader(CommonConstants.HEADER_AUTHORIZATION);
        if (StringUtils.hasText(header) && header.startsWith(tokenPrefix)) {
            return header.substring(tokenPrefix.length()).trim();
        }
        return null;
    }
}
