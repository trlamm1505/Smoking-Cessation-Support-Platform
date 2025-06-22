package com.example.SWP_Backend.dto;

import java.util.List;

public class DayPlanDTO {
    private int day;               // Ngày thứ mấy (1,2,3,...)
    private int stageOrder;        // Số thứ tự giai đoạn
    private String stageName;      // Tên giai đoạn (nếu FE không tự map)
    private String goal;           // Mục tiêu của ngày
    private List<String> activities; // Danh sách các hoạt động trong ngày

    public DayPlanDTO() {}

    public DayPlanDTO(int day, int stageOrder, String stageName, String goal, List<String> activities) {
        this.day = day;
        this.stageOrder = stageOrder;
        this.stageName = stageName;
        this.goal = goal;
        this.activities = activities;
    }

    // Getter và Setter
    public int getDay() { return day; }
    public void setDay(int day) { this.day = day; }

    public int getStageOrder() { return stageOrder; }
    public void setStageOrder(int stageOrder) { this.stageOrder = stageOrder; }

    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public List<String> getActivities() { return activities; }
    public void setActivities(List<String> activities) { this.activities = activities; }
}
