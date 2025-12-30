# CORS Configuration for Spring Boot Backend

## Issue
The frontend (http://localhost:3000) is being blocked by CORS policy when making requests to the backend (http://localhost:8080).

## Solution
You need to configure CORS in your Spring Boot backend to allow requests from the frontend origin.

## Spring Boot CORS Configuration

### Option 1: Global CORS Configuration (Recommended)

Create a configuration class in your Spring Boot application:

```java
package com.yourcompany.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow requests from your Next.js frontend
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        
        // Allow all HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Allow all headers
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // How long the response from a pre-flight request can be cached
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

### Option 2: Using WebMvcConfigurer

```java
package com.yourcompany.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Option 3: Controller-Level CORS (Less Recommended)

Add `@CrossOrigin` annotation to your controller:

```java
package com.yourcompany.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/c2d/api/v1")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class YourController {
    // Your endpoints here
}
```

## For Production

When deploying to production, update the allowed origins:

```java
// Development
config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

// Production
config.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",           // Development
    "https://yourdomain.com",          // Production frontend
    "https://www.yourdomain.com"       // Production frontend with www
));
```

## Security Considerations

1. **Never use `*` for `allowedOrigins` in production** - Always specify exact origins
2. **Set `allowCredentials(true)`** only if you need to send cookies/auth headers
3. **Limit `allowedMethods`** to only what you need
4. **Consider using environment variables** for allowed origins:

```java
@Value("${cors.allowed.origins}")
private String allowedOrigins;

config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
```

Then in `application.properties`:
```properties
# Development
cors.allowed.origins=http://localhost:3000

# Production
cors.allowed.origins=https://yourdomain.com,https://www.yourdomain.com
```

## Testing

After adding the CORS configuration:

1. Restart your Spring Boot application
2. Refresh your Next.js frontend (http://localhost:3000)
3. The API calls should now work without CORS errors

## Troubleshooting

If you still see CORS errors:

1. **Check if the configuration is loaded**: Add logging to verify the CORS filter is active
2. **Verify the origin**: Make sure "http://localhost:3000" exactly matches your frontend URL
3. **Check for multiple CORS configurations**: Having multiple CORS configs can cause conflicts
4. **Clear browser cache**: Sometimes browsers cache CORS preflight responses
5. **Check Spring Security**: If using Spring Security, ensure CORS is configured there too:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // ... other security config
            ;
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```
