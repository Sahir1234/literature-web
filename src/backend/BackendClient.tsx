import { toast } from 'react-toastify';
import { HttpsCallable } from 'firebase/functions';
import { ClientData } from '../model/ClientData';
import { UNKNOWN_ERROR_MESSAGE } from '../utils/AlertMessages';

export interface BackendResponse {
  data: {
      succeeded: boolean;
      message: string;
  }
}

export class BackendClient {

  static callEndpointAndHandleResponse(
    callable: HttpsCallable<any, any>,
    clientData: ClientData,
    successfulResponseHandler: (response: BackendResponse) => void,
    setButtonsDisabled: (disabled: boolean) => void) {

    setButtonsDisabled(true);

    callable(clientData).then((data) => {

      const response = data as BackendResponse;
      if (response.data.succeeded) {
        toast.success(response.data.message);
        successfulResponseHandler(response);
      } else {
        toast.error(response.data.message);
      }

    }).catch((error) => {
      console.error("Error: ", error);
      toast.error(UNKNOWN_ERROR_MESSAGE);
    }).finally(() => {
      setButtonsDisabled(false);
    });
  }
}
