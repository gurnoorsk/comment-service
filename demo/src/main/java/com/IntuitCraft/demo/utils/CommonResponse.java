/**
 * Copyright (c) 2022 Drishti-Soft Solutions Pvt. Ltd.
 *
 * @author: praveenkumar
 * Date:  Dec 5, 2022
 */
package com.IntuitCraft.demo.utils;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.Serializable;
import java.util.UUID;

/**
 *
 */
@Data
@NoArgsConstructor
@Builder
public class CommonResponse<R> implements Serializable {

    @Schema(description = "HTTP code for the response", example = "200")
    @JsonProperty("http_code")
    @Builder.Default
    Integer httpCode = HttpStatus.OK.value();
    @Schema(description = "Request method type", example = "GET")
    @Builder.Default
    String method = RequestMethod.GET.toString();
    @Schema(description = "Request ID generated by system", example = "6da10c2e-1ef7-4206-98ce-410087c9a151")
    @Builder.Default
    @JsonProperty("request_id")
    String requestId = UUID.randomUUID().toString();
    @Schema(description = "Response data")
    R response;

    public CommonResponse(Integer httpCode, String method, String requestId, R response) {
        super();
        this.httpCode = httpCode;
        this.method = method;
        this.requestId = requestId;
        this.response = response;
    }

    public CommonResponse(Integer httpCode, R response) {
        this.httpCode = httpCode;
        this.response = response;
    }
}