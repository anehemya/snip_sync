import React, { useState } from 'react';
import LocationSelect from './components/LocationSelect';
import DateTimeSelect from './components/DateTimeSelect';
import InformationForm from './components/InformationForm';
import ConfirmationPage from './components/ConfirmationPage';
import SuccessPage from './components/SuccessPage';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    location: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    address: '',
    additionalInfo: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateAppointmentData = (data) => {
    console.log('Updating appointment data with:', data);
    setAppointmentData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    if (isSuccess) {
      return <SuccessPage appointmentData={appointmentData} />;
    }

    switch (step) {
      case 1:
        return (
          <LocationSelect 
            onNext={nextStep} 
            updateData={updateAppointmentData}
            selectedLocation={appointmentData.location}
          />
        );
      case 2:
        return (
          <DateTimeSelect 
            onNext={nextStep}
            onPrev={prevStep}
            updateData={updateAppointmentData}
            selectedDate={appointmentData.date}
            selectedTime={appointmentData.time}
          />
        );
      case 3:
        return (
          <InformationForm
            onNext={nextStep}
            onPrev={prevStep}
            updateData={updateAppointmentData}
            formData={appointmentData}
          />
        );
      case 4:
        return (
          <ConfirmationPage
            onPrev={prevStep}
            appointmentData={appointmentData}
            onSuccess={() => setIsSuccess(true)}
          />
        );
      default:
        return <LocationSelect onNext={nextStep} updateData={updateAppointmentData} />;
    }
  };

  return (
    <div className="app-container">
      {renderStep()}
    </div>
  );
}

export default App;
