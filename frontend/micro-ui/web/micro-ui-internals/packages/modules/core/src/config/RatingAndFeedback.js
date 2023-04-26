export const RatingAndFeedBack = {
    isCitizenRatingEnabled : true,
    headerByRating: [
        {
            minvalue : 1,
            maxvalue : 3,
            code : "CS_WHAT_WENT_WRONG"
        },
        {
            minvalue : 4,
            maxvalue : 5,
            code : "CS_WHAT_WENT_GOOD"
        }
    ],
    enabledScreensList:[
        {
            module : "PT",
            bussinessService : "PT_CREATE",
            screenfrom : "pt/property/new-application/acknowledgement",
            cardHeader : "PT_RATE_HELP_TEXT_CREATE",
            cardText : "PT_RATE_CARD_TEXT_CREATE",
        },
        {
            module : "PT",
            bussinessService : "PT_MUTATION",
            screenfrom : "pt/property/property-mutation/acknowledgement",
            cardHeader : "PT_RATE_HELP_TEXT_MUTATE",
            cardText : "PT_RATE_CARD_TEXT_MUTATE",
        },
        {
            module : "PT",
            bussinessService : "PT_UPDATE",
            screenfrom : "pt/property/edit-application/acknowledgement",
            cardHeader : "PT_RATE_HELP_TEXT_UPDATE",
            cardText : "PT_RATE_CARD_TEXT_UPDATE",
        },
        {
            module : "PT",
            bussinessService : "PT",
            screenfrom : "digit-ui/citizen/payment/success",
            cardHeader : "PT_RATE_HELP_TEXT_PAY",
            cardText : "PT_RATE_CARD_TEXT_PAY",
        }
    ]
}