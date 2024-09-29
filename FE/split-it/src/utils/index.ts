const convertDateToDesiredFormat = (dateString: string): string => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short", // This will return "Aug" for August
        day: "numeric",
    });
};

export const formatGroupDetails = (groupDetails: any, userId: any) => {
    try {
        let formattedGrpDetails = [];
        for (let transaction of groupDetails["transactions"]) {
            let tempTrans: any = {};
            tempTrans["id"] = transaction["txn_id"];
            tempTrans["date"] = convertDateToDesiredFormat(transaction["date"]);
            tempTrans["name"] = transaction["txn_name"];
            if (transaction["payer_id"] === userId) {
                let sum = 0;
                for (let i of transaction["payees"]) {
                    if (i["user_id"] === userId) {
                        tempTrans["paid"] = i["amount"];
                        tempTrans["paidBy"] = "You";
                    } else {
                        sum += i["amount"];
                    }
                }
                tempTrans["lent"] = sum;
            } else {
                for (let i of transaction["payees"]) {
                    if (i["user_id"] === userId) {
                        tempTrans["lent"] = i["amount"];
                    } else {
                        if (i["user_id"] === transaction["payer_id"]) {
                            tempTrans["paid"] = transaction["amount"];
                            tempTrans["paidBy"] = i["name"];
                        }
                    }
                }
            }
            if (!tempTrans["lent"]) tempTrans["lent"] = 0;
            formattedGrpDetails.push(tempTrans);
        }
        console.log(formattedGrpDetails);
        return formattedGrpDetails;
    } catch (err) {
        return [];
    }
};
