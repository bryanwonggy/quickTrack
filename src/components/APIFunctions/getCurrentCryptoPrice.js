import axios from "axios";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { UserAuth } from '../../context/AuthContext'

export default function getCurrentCryptoPrice(ticker) {
    const IEX_API_Key = "pk_7ae7f450e7bd4274a7e4ded7019573ae"; //for stock summary data such as PE Ratio
    var IEX_APICallString = `https://cloud.iexapis.com/stable/crypto/${ticker}/quote?token=${IEX_API_Key}`;
    const { user, logout } = UserAuth();
    const userId = (user.email.split("@")[0] + user.email.split("@")[1]).split(".")[0];

    const db = getDatabase();
    const cryptoListRef = ref(db, 'users/' + userId + '/crypto/' + ticker)
    const dbRef = ref(getDatabase());

    axios
        .get(IEX_APICallString)
        .then(function (response) {
            //console.log(response.data['latestPrice']);
            get(child(dbRef, `users/${userId}/crypto/${ticker}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    update(cryptoListRef, {
                        current_price: response.data['latestPrice']
                    }).catch(error => console.log(error));
                }
            })
        })
}
