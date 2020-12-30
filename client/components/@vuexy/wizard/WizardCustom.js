import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import classnames from "classnames"
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form,
  Button, Spinner
} from "reactstrap"

const VuexyCustom = props => {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reachedStep, setReachedStep] = useState(0)

  useEffect(() => {
    setActiveStep(0);
    setReachedStep(0);
  }, [])

  const handleNextStep = async () => {
    const { checkDoneStep } = props
    setLoading(true)
    checkDoneStep[activeStep]()
      .then(() => {
        if (activeStep !== props.steps.length - 1) {
          console.log('step success 1', activeStep, props.steps)
          setActiveStep(activeStep + 1)
          setReachedStep(Math.max(reachedStep, activeStep + 1))
        } else {
          console.log('step success 2')
          setActiveStep(0)
          setReachedStep(0)
        }
        setLoading(false)
      })
      .catch((error) => {

        console.log('step fail')
        setLoading(false)
      })
  }

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1)
  }

  const handleEnableAllSteps = index => {
    if (index < reachedStep) {
      setActiveStep(index)
    }
    if (index - activeStep == 1) {
      handleNextStep()
    }
  }

  return (
    <React.Fragment>
      <Nav
        className={`vx-wizard ${props.className ? props.className : ""
          }`}
        tabs>
        {props.steps.map((item, i) => {
          return (
            <NavItem
              className="step-wrapper"
              key={i}
              onClick={() => handleEnableAllSteps(i)}>
              <NavLink
                className={classnames(`step step-${i}`, {
                  active: activeStep === i ? true : false,
                  done: i < activeStep
                })}>
                <span className="step-text">{item.title}</span>
              </NavLink>
            </NavItem>
          )
        })}
      </Nav>
      <TabContent
        className={`vx-wizard-content ${props.tabPaneClass ? props.tabPaneClass : ""
          }`}
        activeTab={activeStep}>
        {props.steps.map((item, i) => {
          return (
            <TabPane
              className={`step-content step-${i}-content`}
              key={i}
              tabId={i}>
              {item.content}
            </TabPane>
          )
        })}
      </TabContent>
      <div className="wizard-actions d-flex justify-content-between">
        <Button
          type="button"
          color="primary"
          disabled={activeStep === 0}
          onClick={handlePreviousStep}>
          Prev
        </Button>
        <Button
          type="button"
          color="primary"
          className='d-flex align-items-center'
          onClick={handleNextStep}
        >
          {loading ? <Spinner color="white" size="sm" />
            : props.steps.length - 1 === activeStep &&
              !props.finishBtnText
              ? "Submit"
              : props.steps.length - 1 === activeStep &&
                props.finishBtnText
                ? props.finishBtnText
                : "Next"
          }
        </Button>
      </div>
    </React.Fragment>
  )
}

VuexyCustom.propTypes = {
  className: PropTypes.string,
  tabPaneClass: PropTypes.string,
  steps: PropTypes.array.isRequired,
  finishBtnText: PropTypes.string
}


export default VuexyCustom
