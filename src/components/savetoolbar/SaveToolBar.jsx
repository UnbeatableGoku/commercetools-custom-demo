import React from 'react';
import style from './SaveToolBar.module.css';
const SaveToolBar = ({ handleCancel }) => {
  return (
    <div className={style.main}>
      <button
        className={`${style.button} ${style.cancelBtn}`}
        onClick={handleCancel}
      >
        Cancel
      </button>
      <button className={`${style.button} ${style.saveBtn}`} type="submit">
        Save
      </button>
    </div>
  );
};

export default SaveToolBar;
