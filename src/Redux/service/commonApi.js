import axios from "axios";

/**
 * Common API Service to handle all HTTP requests using Axios
 */
export const commonAPI = async (httpRequest, url, reqBody = null, reqHeader = null) => {
  
  // =========================
  // REQUEST CONFIG
  // =========================
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
  };

  /**
   * ✅ NOTE: ഫയലുകൾ (Images) അപ്‌ലോഡ് ചെയ്യുമ്പോൾ reqHeader-ൽ 
   * "Content-Type": "multipart/form-data" വരും. 
   * അല്ലാത്തപ്പോൾ ഡിഫോൾട്ട് ആയി JSON ഹെഡർ ഉപയോഗിക്കും.
   */

  try {
    const result = await axios(reqConfig);
    return result;

  } catch (err) {
    console.group("❌ API Error Report");
    console.error("URL:", url);
    console.error("Method:", httpRequest);

    if (err.response) {
      // സെർവറിൽ നിന്ന് റെസ്‌പോൺസ് ലഭിച്ചു (Error Status Codes like 400, 401, 500)
      console.error("Status Code:", err.response.status);
      console.error("Error Data:", err.response.data);
      console.groupEnd();
      return err.response;

    } else if (err.request) {
      // സെർവറിലേക്ക് റിക്വസ്റ്റ് പോയി, പക്ഷെ മറുപടി ലഭിച്ചില്ല (Network Error)
      console.error("Network Error: No response from server");
      console.groupEnd();
      return {
        status: 503,
        data: {
          success: false,
          message: "Server is not responding. Please check your internet or backend status.",
        },
      };

    } else {
      // മറ്റ് സാങ്കേതിക പിശകുകൾ
      console.error("Technical Error:", err.message);
      console.groupEnd();
      return {
        status: 0,
        data: {
          success: false,
          message: "A technical issue occurred: " + err.message,
        },
      };
    }
  }
};