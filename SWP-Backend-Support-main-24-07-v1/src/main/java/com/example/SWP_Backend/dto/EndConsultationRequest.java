package com.example.SWP_Backend.dto;

/**
 * DTO dùng để truyền dữ liệu khi member hoàn thành buổi tư vấn và gửi phản hồi.
 * Chủ yếu được sử dụng ở API kết thúc buổi tư vấn (submit feedback).
 */
public class EndConsultationRequest {
    // ----------- Các trường dữ liệu ----------
    private String feedback;           // Nội dung phản hồi của member (text tự nhập)
    private Integer feedbackRating;    // Số điểm đánh giá (thường là số sao, ví dụ: 1-5)

    // ----------- Constructors -----------

    // Constructor mặc định (không tham số)
    public EndConsultationRequest() {}

    // Constructor có tham số để khởi tạo nhanh cả 2 trường
    public EndConsultationRequest(String feedback, Integer feedbackRating) {
        this.feedback = feedback;
        this.feedbackRating = feedbackRating;
    }

    // ----------- Getter & Setter ----------

    /**
     * Lấy nội dung phản hồi của member.
     */
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    /**
     * Lấy số điểm đánh giá (feedback rating).
     */
    public Integer getFeedbackRating() { return feedbackRating; }
    public void setFeedbackRating(Integer feedbackRating) { this.feedbackRating = feedbackRating; }
}
