package com.venturo.security;

import com.venturo.entity.User;
import com.venturo.exception.UserNotFoundException;
import com.venturo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // We allow logging in with either email or mobile. 
        // For simplicity, checking email first, then mobile if it contains an '@' or just checking both
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByMobile(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username)));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail() != null ? user.getEmail() : user.getMobile(),
                user.getPasswordHash() != null ? user.getPasswordHash() : "",
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
