const Reopen = ({ text, reopenDate }) => {
  // let { t } = useTranslation();
  // let reopenDate = ConvertTimestampToDate(obj.auditDetails.createdTime);
  return (
    <React.Fragment>
      <div>{text}</div>
      <GreyOutText>{reopenDate}</GreyOutText>
    </React.Fragment>
  );
};

export default Reopen;
