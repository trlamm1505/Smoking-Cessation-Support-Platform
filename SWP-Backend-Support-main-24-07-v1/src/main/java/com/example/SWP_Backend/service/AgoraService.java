package com.example.SWP_Backend.service;

import io.agora.media.RtcTokenBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AgoraService {

    @Value("${agora.appId}")
    private String appId;

    @Value("${agora.appCertificate}")
    private String appCertificate;

//    public String generateRtcToken(String channelName, int uid, int expireSeconds) {
//        RtcTokenBuilder builder = new RtcTokenBuilder();
//        int timestamp = (int) (System.currentTimeMillis() / 1000);
//        int privilegeExpiredTs = timestamp + expireSeconds;
//        return builder.buildTokenWithUid(
//                appId,
//                appCertificate,
//                channelName,
//                uid,
//                RtcTokenBuilder.Role.Role_Publisher,
//                privilegeExpiredTs
//        );
//
//    }
public String generateRtcToken(String channelName, int uid, int expireSeconds) {
    RtcTokenBuilder builder = new RtcTokenBuilder();
    int timestamp = (int) (System.currentTimeMillis() / 1000);
    int privilegeExpiredTs = timestamp + expireSeconds;
    String token = builder.buildTokenWithUid(
            appId, appCertificate, channelName, uid,
            RtcTokenBuilder.Role.Role_Publisher, privilegeExpiredTs
    );
    // --- LOG ---
    System.out.println("[Agora] Sinh token mới | channelName=" + channelName + " | uid=" + uid + " | token=" + token + " | expire=" + privilegeExpiredTs);
    return token;
}

}