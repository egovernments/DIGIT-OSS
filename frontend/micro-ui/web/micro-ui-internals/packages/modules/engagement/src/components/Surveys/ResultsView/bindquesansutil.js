
export const bindQuesWithAns = (ques,ans) => {
    let data = []
    ques.map(ques => {
        let obj = {}
        if(ques.type==="Check Boxes"){
            obj["type"] = ques.type;
            obj["questionStatement"] = ques.questionStatement
            obj["options"]=ques.options
            obj["answers"]=[]

            ans.map(ans =>{
            if(ques.uuid===ans.questionId){
               obj["timeStamp"] = `${Digit.DateUtils.ConvertEpochToDate(ans?.auditDetails?.lastModifiedTime)} ${Digit.DateUtils.ConvertEpochToTimeInHours(ans?.auditDetails?.lastModifiedTime) }`
                obj["answers"] = [...obj["answers"],ans.answer]
            }
        })
        }else{
        const type = ques.type
        obj["type"] = type
        obj["questionStatement"] = ques.questionStatement
        obj["options"]=ques.options
        ans.map(ans =>{
            if(ques.uuid===ans.questionId){
                obj["timeStamp"] = `${Digit.DateUtils.ConvertEpochToDate(ans?.auditDetails?.lastModifiedTime)} ${Digit.DateUtils.ConvertEpochToTimeInHours(ans?.auditDetails?.lastModifiedTime)}`
                const answers = obj["answers"]
                if(answers) answers.push(ans.answer[0])
                obj["answers"] = answers ? answers : [ans.answer[0]];
            }
        })
        }
        
        data.push(obj)
    })

return data;
}
