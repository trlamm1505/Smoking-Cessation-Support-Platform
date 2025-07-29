package com.example.SWP_Backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Service xử lý xác thực Google Sign-In cho hệ thống (login/register với Google).
 * - Kiểm tra tính hợp lệ của Google ID Token do phía client gửi lên.
 * - Nếu hợp lệ, trích xuất thông tin user (payload) từ Google và trả về cho backend tạo tài khoản hoặc login.
 */
@Service
public class GoogleAuthService {

    // Đọc giá trị google.client-id từ file cấu hình (application.properties hoặc application.yml)
    @Value("${google.client-id}")
    private String googleClientId;

    /**
     * Xác thực và giải mã Google ID Token.
     * @param idTokenString: Mã token do client gửi lên sau khi user xác thực Google.
     * @return Trả về GoogleIdToken.Payload nếu hợp lệ; trả về null nếu token sai hoặc hết hạn.
     */
    public GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            // Tạo một đối tượng verifier sử dụng clientId của hệ thống (chống giả mạo token)
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),   // Khởi tạo transport HTTP
                    GsonFactory.getDefaultInstance())               // Sử dụng Gson để parse dữ liệu JSON
                    .setAudience(Collections.singletonList(googleClientId)) // Đảm bảo token đúng audience (ứng dụng của bạn)
                    .build();

            // Kiểm tra token (verify)
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                // Nếu token hợp lệ, lấy thông tin payload (email, name, picture, ...)
                return idToken.getPayload();
            }
        } catch (Exception e) {
            // Nếu có lỗi xác thực, ghi log và trả về null
            e.printStackTrace();
        }
        // Token không hợp lệ hoặc có lỗi, trả về null
        return null;
    }
}
