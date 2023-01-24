import { Card, CardHeader } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { subFormRegistry } from "@egovernments/digit-ui-libraries";

export const SubformComposer = ({ _key, ...props }) => {
  const config = subFormRegistry._registry[_key];
  const { setValue, setError, control, watch, getValues } = useForm({ shouldFocusError: true });
  const [state, setState] = useState(config?.state);

  const _setState = useCallback((obj) => {
    setState((oldState) => ({ ...oldState, ...obj }));
  }, []);

  const clearState = useCallback(() => {
    setState(config.state);
  }, []);

  const formData = watch();

  useEffect(() => {
    (async () => {
      props.getSubFormValue(await callMiddlewares(formData));
    })();
  }, [formData]);

  const callMiddlewares = useCallback(async (data) => {
    let applyBreak = false;
    let itr = -1;
    let _break = () => (applyBreak = true);
    let _next = async (data) => {
      if (!applyBreak && ++itr < config?.middlewares.length) {
        let key = Object.keys(config?.middlewares[itr])[0];
        let nextMiddleware = config?.middlewares[itr][key];
        let isAsync = nextMiddleware.constructor.name === "AsyncFunction";
        if (isAsync) return await nextMiddleware(data, _break, _next);
        else return nextMiddleware(data, _break, _next);
      } else return data;
    };
    let ret = await _next(data);
    return ret;
  }, []);

  const allFields = useMemo(() => (config && [...config?.fields, ...config?.addedFields]) || [], [config]);

  return (
    <React.Fragment>
      <form>
        <Card>
          <CardHeader>{_key}</CardHeader>
          {allFields.map(({ label, component, customProps, defaultValue, name }, index) => {
            let _customProps = typeof customProps === "function" ? customProps(state, _setState) : customProps;
            let _defaultValue = typeof defaultValue === "function" ? defaultValue(state, _setState) : defaultValue;
            return (
              <div key={index} className="subform-composer">
                {label && <div className="w-half">{label}</div>}
                <div className={label && "w-half"}>
                  <Controller
                    defaultValue={_defaultValue}
                    name={name}
                    control={control}
                    render={(props) => component({ ...props, setState: _setState, setValue, setError, state, getValues }, _customProps)}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      </form>
    </React.Fragment>
  );
};
