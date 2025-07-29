package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.CommunityPostsCreateRequest;
import com.example.SWP_Backend.dto.CommunityPostsDTO;
import com.example.SWP_Backend.entity.CommunityPosts;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.UserRepository;
import com.example.SWP_Backend.service.CommunityPostsLikeService;
import com.example.SWP_Backend.service.CommunityPostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * RESTful Controller cho quản lý bài viết cộng đồng, bao gồm cả thả tim (like).
 * Tích hợp tối ưu trả về số lượt like và trạng thái đã like cho từng bài viết.
 */
@RestController
@RequestMapping("/api/community-posts")
public class CommunityPostsController {

    @Autowired
    private CommunityPostsService communityPostsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommunityPostsLikeService communityPostsLikeService;

    // ===== CRUD BÀI VIẾT =====

    /**
     * API: Tạo bài viết mới
     */
    @PostMapping
    public CommunityPostsDTO createCommunityPost(@RequestBody CommunityPostsCreateRequest req) {
        User author = userRepository.findById(req.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + req.getAuthorId()));

        CommunityPosts post = new CommunityPosts();
        post.setAuthor(author);
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setFeaturedImageURL(req.getFeaturedImageURL());
        post.setBadges(req.getBadges());
        post.setStatus(req.getStatus() != null ? req.getStatus() : "published");
        post.setPublishDate(LocalDateTime.now());
        post.setViews(0);

        return communityPostsService.createCommunityPost(post);
    }

    /**
     * API: Lấy tất cả bài viết (dành cho admin hoặc FE nếu muốn)
     * Truyền lên userId nếu FE đã đăng nhập để trả về trạng thái đã like từng bài
     */
    @GetMapping
    public List<CommunityPostsDTO> getAllCommunityPosts(@RequestParam(required = false) Long userId) {
        return communityPostsService.getAllCommunityPosts(userId);
    }

    /**
     * API: Lấy 1 bài viết theo id, có thể truyền userId để trả về trạng thái đã like
     */
    @GetMapping("/{id}")
    public CommunityPostsDTO getCommunityPostById(@PathVariable Long id,
                                                  @RequestParam(required = false) Long userId) {
        return communityPostsService.getCommunityPostById(id, userId)
                .orElseThrow(() -> new RuntimeException("CommunityPost not found with id " + id));
    }

    /**
     * API: Sửa bài viết (update)
     */
    @PutMapping("/{id}")
    public CommunityPostsDTO updateCommunityPost(@PathVariable Long id, @RequestBody CommunityPostsCreateRequest req) {
        User author = userRepository.findById(req.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + req.getAuthorId()));

        CommunityPosts existingPost = communityPostsService.getEntityById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));

        existingPost.setAuthor(author);
        existingPost.setTitle(req.getTitle());
        existingPost.setContent(req.getContent());
        existingPost.setFeaturedImageURL(req.getFeaturedImageURL());
        existingPost.setBadges(req.getBadges());
        existingPost.setStatus(req.getStatus());
        existingPost.setLastModifiedDate(LocalDateTime.now());

        return communityPostsService.updateCommunityPost(id, existingPost);
    }

    /**
     * API: Xóa bài viết (xóa cứng, thường nên chuyển sang xóa mềm/soft delete)
     */
    @DeleteMapping("/{id}")
    public void deleteCommunityPost(@PathVariable Long id) {
        communityPostsService.deleteCommunityPost(id);
    }

    // ===== PUBLIC/ADMIN VIEW =====

    /**
     * API: Lấy tất cả bài đã duyệt (status = "published"), FE gọi API này để show cho user thường.
     * Truyền userId nếu muốn biết trạng thái đã like từng bài cho user đó.
     */
    @GetMapping("/public")
    public List<CommunityPostsDTO> getAllPublishedPosts(@RequestParam(required = false) Long userId) {
        return communityPostsService.getAllPublishedPosts(userId);
    }

    /**
     * API: Lấy tất cả bài chưa bị xóa (cho admin), gồm các trạng thái published, pending, rejected
     */
    @GetMapping("/admin")
    public List<CommunityPostsDTO> getAllVisiblePostsForAdmin(@RequestParam(required = false) Long userId) {
        return communityPostsService.getAllVisiblePostsForAdmin(userId);
    }

    // ===== ADMIN DUYỆT, TỪ CHỐI, XÓA (SOFT DELETE) =====

    /**
     * API: Admin duyệt bài (chuyển sang trạng thái "published")
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approvePost(@PathVariable Long id) {
        CommunityPostsDTO updated = communityPostsService.updateStatus(id, "published");
        return ResponseEntity.ok(updated);
    }

    /**
     * API: Admin từ chối bài (chuyển sang trạng thái "rejected")
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectPost(@PathVariable Long id) {
        CommunityPostsDTO updated = communityPostsService.updateStatus(id, "rejected");
        return ResponseEntity.ok(updated);
    }

    /**
     * API: Admin ẩn/xóa bài (soft delete)
     */
    @PutMapping("/{id}/delete")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        CommunityPostsDTO updated = communityPostsService.updateStatus(id, "deleted");
        return ResponseEntity.ok(updated);
    }

    // ===== API THẢ TIM (LIKE/UNLIKE/COUNT/CHECK) =====

    /**
     * API: Thả tim bài đăng (Like)
     * @param postId  ID bài viết
     * @param userId  ID user thực hiện like (truyền lên từ FE)
     */
    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postId, @RequestParam Long userId) {
        communityPostsLikeService.likePost(postId, userId);
        return ResponseEntity.ok("Liked");
    }

    /**
     * API: Bỏ thả tim bài đăng (Unlike)
     */
    @PostMapping("/{postId}/unlike")
    public ResponseEntity<?> unlikePost(@PathVariable Long postId, @RequestParam Long userId) {
        communityPostsLikeService.unlikePost(postId, userId);
        return ResponseEntity.ok("Unliked");
    }

    /**
     * API: Đếm số lượt thả tim của bài đăng (FE có thể không cần vì đã trả về sẵn trong DTO)
     */
    @GetMapping("/{postId}/likes/count")
    public long countLikes(@PathVariable Long postId) {
        return communityPostsLikeService.countLikes(postId);
    }

    /**
     * API: Kiểm tra user đã like bài này chưa (FE dùng để đổi màu nút, tuy nhiên đã trả về trong DTO)
     */
    @GetMapping("/{postId}/likes/is-liked")
    public boolean isLiked(@PathVariable Long postId, @RequestParam Long userId) {
        return communityPostsLikeService.isLiked(postId, userId);
    }
}
