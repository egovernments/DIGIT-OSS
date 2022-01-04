import React from "react";
import Card from "../atoms/Card";
import KeyNote from "../atoms/KeyNote";
import SubmitBar from "../atoms/SubmitBar";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";

const ResponseComposer = ({ data, template, actionButtonLabel, onSubmit }) => {
  const { t } = useTranslation();
  return (
    <div>
      {data.map((result, i) => {
        return (
          <Card key={i} className="box-shadow-none">
            {template.map((field, j) => {
              return (
                <KeyNote
                  key={i + "" + j}
                  keyValue={t(field.label)}
                  note={field.notePrefix ? field.notePrefix + result[field.key] : result[field.key]}
                  noteStyle={field.noteStyle}
                />
              );
            })}
            {actionButtonLabel && (
              <SubmitBar
                submit={false}
                label={t(actionButtonLabel)}
                onSubmit={() => {
                  onSubmit(result);
                }}
              />
            )}
          </Card>
        );
      })}
    </div>
  );
};

ResponseComposer.propTypes = {
  data: PropTypes.array,
  template: PropTypes.array,
  actionButtonLabel: PropTypes.string,
  onSubmit: PropTypes.func,
};

ResponseComposer.defaultProps = {
  data: [],
  template: [],
  actionButtonLabel: "",
  onSubmit: () => {},
};

export default ResponseComposer;
