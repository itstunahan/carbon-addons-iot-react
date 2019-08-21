import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SkeletonText } from 'carbon-components-react';

import ButtonEnhanced from '../ButtonEnhanced/ButtonEnhanced';
import Hero, { HeroPropTypes } from '../Hero/Hero';

const StyledEditPage = styled.div`
  &&& {
    width: 100%;
    max-width: 100%;
    max-height: unset;
    border: 0;
  }
`;

const StyledPageContent = styled.div`
   {
    display: flex;
    flex-flow: column;
    min-height: calc(100vh - 125px);
    padding: 1rem 2rem;
    padding-bottom: 7rem;
  }
`;

const StyledPageFooter = styled.div`
  &&& {
    position: fixed;
    bottom: 0rem;
    left: 0rem;
    right: 2rem;
  }
`;

const propTypes = {
  ...HeroPropTypes,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  /** Labels needed to support i18n */
  i18n: PropTypes.shape({
    saveLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    closeLabel: PropTypes.string,
  }),
};

const defaultProps = {
  className: null,
  isLoading: false,
  i18n: {
    saveLabel: 'Save',
    cancelLabel: 'Cancel',
    closeLabel: 'Close,',
  },
};

/**
 * This component gives us a fullscreen editor page, for editing an existing item
 * @param {*} param0
 */
const EditPage = ({
  className,
  onClose,
  onSave,
  children,
  i18n: { saveLabel, cancelLabel },
  i18n,
  isLoading,
  blurb,
  ...others
}) => {
  const [isSaving, setSaving] = useState();
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      onClose();
    } catch {
      setSaving(false);
    }
  };
  return (
    <StyledEditPage className={className}>
      {isLoading ? (
        <Fragment>
          <Hero {...others} description={blurb} onClose={onClose} i18n={i18n} isLoading />
          <StyledPageContent>
            <SkeletonText width="30%" />
          </StyledPageContent>
        </Fragment>
      ) : (
        <Fragment>
          <Hero {...others} description={blurb} onClose={onClose} i18n={i18n} />
          <StyledPageContent>{children}</StyledPageContent>
          <StyledPageFooter className="bx--modal-footer">
            <ButtonEnhanced kind="secondary" onClick={onClose}>
              {cancelLabel}
            </ButtonEnhanced>
            <ButtonEnhanced onClick={handleSave} loading={isSaving}>
              {saveLabel}
            </ButtonEnhanced>
          </StyledPageFooter>
        </Fragment>
      )}
    </StyledEditPage>
  );
};

EditPage.propTypes = propTypes;
EditPage.defaultProps = defaultProps;
export default EditPage;