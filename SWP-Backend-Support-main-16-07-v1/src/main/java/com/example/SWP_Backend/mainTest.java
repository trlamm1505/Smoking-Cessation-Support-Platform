package com.example.SWP_Backend;

public class mainTest {
    public static String tinhMucDo(int years, int cigarettesPerDay) {
        double packYear = (cigarettesPerDay / 20.0) * years;
        if (packYear < 5) return "Nhẹ";
        else if (packYear < 20) return "Trung bình";
        else return "Nặng";
    }

    public static void main(String[] args) {
        System.out.println("Tinh Muc do " + tinhMucDo(20, 20));
        System.out.println("Phạm Võ Khải Anh");

        int percent = 80;
        int cigarettesPerDay = 10;
        System.out.println("percent = " + percent);
        System.out.println("percent / 100.0 = " + (percent / 100.0));
        System.out.println("1 - percent/100.0 = " + (1 - percent / 100.0));
        System.out.println("Thành tiền: " + cigarettesPerDay * (1 - percent / 100.0));

    }
}
