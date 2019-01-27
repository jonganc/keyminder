import React from 'react';
import { Label as LabelType } from '../model/types';

const Label: React.SFC<{ className?: string; label: LabelType }> = props => (
  <div
    className={props.className}
    dangerouslySetInnerHTML={
      typeof props.label !== 'string' ? undefined : { __html: props.label }
    }
  >
    {typeof props.label === 'string' ? undefined : props.label}
  </div>
);

export default Label;
