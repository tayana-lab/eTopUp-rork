import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignatureScreen from 'react-native-signature-canvas';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { 
  Camera,
  FileText,
  User,
  Package,
  Smartphone,
  CheckCircle,
  ChevronRight,
  Search,
  QrCode,
  Check,
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import { getAllDistricts, getSubDistrictsByDistrict } from '@/constants/seychelles-districts';

type OnboardingStep = 'capture-photo' | 'scan-id' | 'customer-details' | 'package' | 'sim' | 'confirmation';

type CustomerType = 'local' | 'gop-holder' | 'tourist';

interface CustomerDetails {
  name: string;
  surname: string;
  dateOfBirth: string;
  gender: string;
  idNumber: string;
  expirationDate: string;
  customerType: CustomerType;
  country?: string;
  district?: string;
  subDistrict?: string;
}

interface StepInfo {
  id: OnboardingStep;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
}

export default function DigitalOnboardScreen() {
  const params = useLocalSearchParams();
  const customerName = Array.isArray(params.customerName) ? params.customerName[0] : params.customerName;
  const insets = useSafeAreaInsets();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('capture-photo');
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set());
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const customerTypeFromParams = Array.isArray(params.customerType) ? params.customerType[0] : params.customerType;
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: customerName || 'John',
    surname: 'Smith',
    dateOfBirth: '01/01/1990',
    gender: 'Male',
    idNumber: '123456789',
    expirationDate: '01/01/2030',
    customerType: (customerTypeFromParams as CustomerType) || 'local',
    district: '',
    subDistrict: '',
    country: customerTypeFromParams === 'tourist' ? '' : undefined
  });
  const [detailsVerified, setDetailsVerified] = useState<boolean>(false);
  const [confirmationVerified, setConfirmationVerified] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedSim, setSelectedSim] = useState<string>('');
  const [simSearchQuery, setSimSearchQuery] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [isSigningActive, setIsSigningActive] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const signatureRef = useRef<any>(null);

  const districts = getAllDistricts();
  const subDistricts = customerDetails.district ? getSubDistrictsByDistrict(customerDetails.district) : [];

  const countries = [
    { id: 'seychelles', name: 'Seychelles' },
    { id: 'mauritius', name: 'Mauritius' },
    { id: 'madagascar', name: 'Madagascar' },
    { id: 'south-africa', name: 'South Africa' },
    { id: 'france', name: 'France' },
    { id: 'uk', name: 'United Kingdom' },
    { id: 'germany', name: 'Germany' },
    { id: 'italy', name: 'Italy' },
    { id: 'usa', name: 'United States' },
    { id: 'canada', name: 'Canada' },
    { id: 'australia', name: 'Australia' },
    { id: 'other', name: 'Other' }
  ];

  // Mock package data
  const packages = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$10/month',
      data: '5GB',
      calls: 'Unlimited local calls',
      sms: '100 SMS',
      validity: '30 days',
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: '$25/month',
      data: '15GB',
      calls: 'Unlimited local & international calls',
      sms: 'Unlimited SMS',
      validity: '30 days',
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$50/month',
      data: '50GB',
      calls: 'Unlimited local & international calls',
      sms: 'Unlimited SMS',
      validity: '30 days',
    },
  ];

  // Mock SIM data
  const allSims = [
    { id: 'sim1', msisdn: '2484567890', sim: 'SIM001234567890', puk: '12345678', status: 'Available' },
    { id: 'sim2', msisdn: '2484567891', sim: 'SIM001234567891', puk: '12345679', status: 'Available' },
    { id: 'sim3', msisdn: '2484567892', sim: 'SIM001234567892', puk: '12345680', status: 'Available' },
    { id: 'sim4', msisdn: '2484567893', sim: 'SIM001234567893', puk: '12345681', status: 'Available' },
    { id: 'sim5', msisdn: '2484567894', sim: 'SIM001234567894', puk: '12345682', status: 'Available' },
  ];

  const filteredSims = allSims.filter(sim => 
    sim.msisdn.includes(simSearchQuery) || 
    sim.sim.toLowerCase().includes(simSearchQuery.toLowerCase())
  );

  const steps: StepInfo[] = [
    {
      id: 'capture-photo',
      title: 'Capture Photo',
      description: 'Take customer photo using back camera',
      icon: Camera,
      completed: completedSteps.has('capture-photo'),
    },
    {
      id: 'scan-id',
      title: 'Scan ID',
      description: 'Scan customer ID document',
      icon: FileText,
      completed: completedSteps.has('scan-id'),
    },
    {
      id: 'customer-details',
      title: 'Customer Details',
      description: 'Auto-filled from scanned ID',
      icon: User,
      completed: completedSteps.has('customer-details'),
    },
    {
      id: 'package',
      title: 'Package Selection',
      description: 'Choose from available packages',
      icon: Package,
      completed: completedSteps.has('package'),
    },
    {
      id: 'sim',
      title: 'SIM Selection',
      description: 'Choose SIM with number search',
      icon: Smartphone,
      completed: completedSteps.has('sim'),
    },
    {
      id: 'confirmation',
      title: 'Sale Summary',
      description: 'Review and submit information',
      icon: CheckCircle,
      completed: completedSteps.has('confirmation'),
    },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleStepPress = (stepId: OnboardingStep) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    // Allow navigation to previous steps or next step if current is completed
    if (stepIndex <= currentIndex || completedSteps.has(currentStep)) {
      setCurrentStep(stepId);
      // Force re-render to update colors
      setCompletedSteps(prev => new Set([...prev]));
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      // Move to next step
      const nextIndex = currentStepIndex + 1;
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleStepAction = () => {
    switch (currentStep) {
      case 'capture-photo':
        handleCapturePhoto();
        break;
      case 'scan-id':
        handleScanId();
        break;
      case 'customer-details':
        handleCustomerDetails();
        break;
      case 'package':
        handlePackageSelection();
        break;
      case 'sim':
        handleSimSelection();
        break;
      case 'confirmation':
        handleConfirmation();
        break;
    }
  };

  const handleCapturePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Camera', 'Camera functionality is limited on web. Photo captured successfully!');
      handleNext();
      return;
    }

    if (!permission) {
      await requestPermission();
      return;
    }

    if (!permission.granted) {
      Alert.alert(
        'Camera Permission',
        'Camera permission is required to capture photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestPermission },
        ]
      );
      return;
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedPhoto(photo.uri);
        setShowCamera(false);
        // Don't auto-navigate, stay on the same page
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setShowCamera(true);
  };

  const handleScanId = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Scanner', 'Scanner functionality is limited on web. ID scanned successfully!');
      // Simulate scanned ID for web
      setScannedId('mock-id-scan.jpg');
      return;
    }

    if (!permission) {
      await requestPermission();
      return;
    }

    if (!permission.granted) {
      Alert.alert(
        'Camera Permission',
        'Camera permission is required to scan ID documents.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestPermission },
        ]
      );
      return;
    }

    setShowCamera(true);
  };

  const scanDocument = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setScannedId(photo.uri);
        setShowCamera(false);
        // Don't auto-navigate, stay on the same page
      } catch (error) {
        console.error('Error scanning document:', error);
        Alert.alert('Error', 'Failed to scan document. Please try again.');
      }
    }
  };

  const retakeScan = () => {
    setScannedId(null);
    setShowCamera(true);
  };

  const handleQrScan = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('QR Scanner', 'QR code scanning functionality is limited on web.');
      return;
    }

    if (!permission) {
      await requestPermission();
      return;
    }

    if (!permission.granted) {
      Alert.alert(
        'Camera Permission',
        'Camera permission is required to scan QR codes.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestPermission },
        ]
      );
      return;
    }

    // Simulate QR scan result for now
    const mockQrResult = '2484567892'; // Mock scanned SIM number
    setSimSearchQuery(mockQrResult);
    Alert.alert('QR Scanned', `Found SIM: ${mockQrResult}`);
  };

  const handleCustomerDetails = () => {
    // Validation based on customer type
    if (customerDetails.customerType !== 'tourist') {
      if (!customerDetails.district || !customerDetails.subDistrict) {
        Alert.alert('Missing Information', 'Please select both District and Sub-District.');
        return;
      }
    } else {
      if (!customerDetails.country) {
        Alert.alert('Missing Information', 'Please select Country.');
        return;
      }
    }
    
    if (!detailsVerified) {
      Alert.alert('Verification Required', 'Please confirm that the details have been verified.');
      return;
    }
    handleNext();
  };

  const handleDistrictChange = (districtId: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      district: districtId,
      subDistrict: '' // Reset sub-district when district changes
    }));
  };

  const handleCustomerDetailChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePackageSelection = () => {
    if (!selectedPackage) {
      Alert.alert('Package Required', 'Please select a package.');
      return;
    }
    handleNext();
  };

  const handleSimSelection = () => {
    if (!selectedSim) {
      Alert.alert('SIM Required', 'Please select a SIM card.');
      return;
    }
    handleNext();
  };

  const handleConfirmation = () => {
    if (!confirmationVerified) {
      Alert.alert('Confirmation Required', 'Please confirm that all information is accurate and verified.');
      return;
    }
    if (!signature) {
      Alert.alert('Signature Required', 'Please provide your digital signature to complete the onboarding process.');
      return;
    }
    // Navigate to congratulations page
    router.push('/onboarding-success');
  };

  const handleSignature = (signature: string) => {
    setSignature(signature);
    setIsSigningActive(false);
  };

  const handleSignatureEmpty = () => {
    console.log('Signature is empty');
  };

  const clearSignature = () => {
    signatureRef.current?.clearSignature();
    setSignature('');
    setIsSigningActive(false);
  };

  const saveSignature = () => {
    signatureRef.current?.readSignature();
  };

  const handleSignatureBegin = useCallback(() => {
    setIsSigningActive(true);
  }, []);

  const handleSignatureEnd = useCallback(() => {
    setIsSigningActive(false);
  }, []);

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.completed;
        const isAccessible = index <= currentStepIndex || isCompleted;
        
        return (
          <TouchableOpacity
            key={step.id}
            style={[
              styles.stepItem,
              isActive && styles.stepItemActive,
              isCompleted && styles.stepItemCompleted,
              !isAccessible && styles.stepItemDisabled,
            ]}
            onPress={() => isAccessible ? handleStepPress(step.id) : null}
            disabled={!isAccessible}
          >
           <View style={[
  styles.stepCircle,
  isActive
    ? styles.stepCircleActive
    : isCompleted
    ? styles.stepCircleCompleted
    : null,
]}>
<Text style={[
    styles.stepNumber,
    (isActive || isCompleted) && styles.stepNumberActive,
]}>
  {index + 1}
</Text>
</View>
            <Text style={[
              styles.stepTitle,
              isActive && styles.stepTitleActive,
              !isAccessible && styles.stepTitleDisabled,
            ]} numberOfLines={2}>
              {step.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderStepContent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;

    const IconComponent = step.icon;

    return (
      <View style={styles.stepContent}>
        <View style={styles.stepBody}>
          {renderStepSpecificContent()}
        </View>
      </View>
    );
  };

  const renderStepSpecificContent = () => {
    switch (currentStep) {
      case 'capture-photo':
        return (
          <View style={styles.contentContainer}>
            {capturedPhoto ? (
              <View style={styles.photoContainer}>
                <View style={styles.photoFrame}>
                  <Image source={{ uri: capturedPhoto }} style={styles.capturedPhoto} />
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={retakePhoto}>
                  <Camera size={20} color={Theme.Colors.white} />
                  <Text style={styles.actionButtonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoContainer}>
                <View style={styles.photoFrameCenter}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' }} 
                    style={styles.placeholderImage}
                  />
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handleCapturePhoto}>
                  <Camera size={20} color={Theme.Colors.white} />
                  <Text style={styles.actionButtonText}>Capture</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'scan-id':
        return (
          <View style={styles.contentContainer}>
            {scannedId ? (
              <View style={styles.photoContainer}>
                <View style={styles.documentFrame}>
                  <Image source={{ uri: scannedId }} style={styles.documentPhoto} />
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={retakeScan}>
                  <FileText size={20} color={Theme.Colors.white} />
                  <Text style={styles.actionButtonText}>Re-Scan</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoContainer}>
                <View style={styles.documentFrameCenter}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop' }} 
                    style={styles.placeholderDocumentImage}
                  />
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handleScanId}>
                  <FileText size={20} color={Theme.Colors.white} />
                  <Text style={styles.actionButtonText}>Scan</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'customer-details':
        return (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.customerDetailsForm}>
              {/* Customer Type Selection */}
              
              {/* Personal Information */}
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Input
                  value={customerDetails.name}
                  editable={false}
                  style={styles.detailValue}
                  containerStyle={styles.readOnlyInput}
                />
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Surname</Text>
                <Input
                  value={customerDetails.surname}
                  editable={false}
                  style={styles.detailValue}
                  containerStyle={styles.readOnlyInput}
                />
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date of Birth</Text>
                <Input
                  value={customerDetails.dateOfBirth}
                  editable={false}
                  style={styles.detailValue}
                  containerStyle={styles.readOnlyInput}
                />
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gender</Text>
                <Input
                  value={customerDetails.gender}
                  editable={false}
                  style={styles.detailValue}
                  containerStyle={styles.readOnlyInput}
                />
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID Number</Text>
                <Input
                  value={customerDetails.idNumber}
                  editable={false}
                  style={styles.detailValue}
                  containerStyle={styles.readOnlyInput}
                />
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expiration Date</Text>
                <Input
                  value={customerDetails.expirationDate}
                  editable={false}
                  style={styles.detailValue}
                  containerStyle={styles.readOnlyInput}
                />
              </View>
              
              {customerDetails.customerType === 'tourist' ? (
                <View style={styles.dropdownSection}>
                  <Dropdown
                    title="Nationality"
                    options={countries}
                    selectedValue={customerDetails.country || ''}
                    onSelect={(value) => handleCustomerDetailChange('country', value)}
                    placeholder="Select Nationality"
                  />
                </View>
              ) : (
                <View style={styles.dropdownSection}>
                  <Dropdown
                    title="District"
                    options={districts.map(d => ({ id: d.id, name: d.name }))}
                    selectedValue={customerDetails.district || ''}
                    onSelect={handleDistrictChange}
                    placeholder="Select District"
                  />
                  
                  <Dropdown
                    title="Sub-District"
                    options={subDistricts.map(sd => ({ id: sd.id, name: sd.name }))}
                    selectedValue={customerDetails.subDistrict || ''}
                    onSelect={(value) => handleCustomerDetailChange('subDistrict', value)}
                    placeholder="Select Sub-District"
                    disabled={!customerDetails.district}
                  />
                </View>
              )}

              <TouchableOpacity 
                style={styles.checkboxContainer} 
                onPress={() => setDetailsVerified(!detailsVerified)}
              >
                <View style={[styles.checkbox, detailsVerified && styles.checkboxChecked]}>
                  {detailsVerified && <Check size={16} color={Theme.Colors.white} />}
                </View>
                <Text style={styles.checkboxText}>
                  I confirm the above details have been verified
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 'package':
        return (
          <View style={styles.packageContainer}>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.packageScrollContent}>
              <View style={styles.packageGrid}>
                {packages.map((pkg, index) => {
                  const isSelected = selectedPackage === pkg.id;
                  const isPopular = index === 1; // Make middle package popular
                  
                  return (
                    <TouchableOpacity 
                      key={pkg.id} 
                      style={[
                        styles.packageCardCompact,
                        isSelected && styles.packageCardCompactSelected,
                        isPopular && styles.packageCardCompactPopular
                      ]}
                      onPress={() => setSelectedPackage(pkg.id)}
                    >
                      {isPopular && (
                        <View style={styles.popularBadgeCompact}>
                          <Text style={styles.popularBadgeCompactText}>POPULAR</Text>
                        </View>
                      )}
                      
                      <View style={styles.packageCardCompactHeader}>
                        <Text style={styles.packageNameCompact}>{pkg.name}</Text>
                        <View style={[
                          styles.packageSelectCircleCompact,
                          isSelected && styles.packageSelectCircleCompactSelected
                        ]}>
                          {isSelected && <Check size={12} color={Theme.Colors.white} />}
                        </View>
                      </View>
                      
                      <Text style={styles.packagePriceCompact}>{pkg.price}</Text>
                      
                      <View style={styles.packageFeaturesCompact}>
                        <View style={styles.packageFeatureRowCompact}>
                          <Text style={styles.packageFeatureLabelCompact}>📊 Data:</Text>
                          <Text style={styles.packageFeatureValueCompact}>{pkg.data}</Text>
                        </View>
                        
                        <View style={styles.packageFeatureRowCompact}>
                          <Text style={styles.packageFeatureLabelCompact}>📞 Calls:</Text>
                          <Text style={styles.packageFeatureValueCompact}>{pkg.calls.length > 20 ? 'Unlimited' : pkg.calls}</Text>
                        </View>
                        
                        <View style={styles.packageFeatureRowCompact}>
                          <Text style={styles.packageFeatureLabelCompact}>💬 SMS:</Text>
                          <Text style={styles.packageFeatureValueCompact}>{pkg.sms}</Text>
                        </View>
                        
                        <View style={styles.packageFeatureRowCompact}>
                          <Text style={styles.packageFeatureLabelCompact}>⏰ Valid:</Text>
                          <Text style={styles.packageFeatureValueCompact}>{pkg.validity}</Text>
                        </View>
                      </View>
                      
                      {isSelected && (
                        <View style={styles.packageSelectedIndicator}>
                          <Text style={styles.packageSelectedText}>✓ SELECTED</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        );

      case 'sim':
        return (
          <View style={styles.simContainer}>
            <View style={styles.searchSection}>
              <View style={styles.searchInputWrapper}>
                <Input
                  placeholder="Search MSISDN or SIM number..."
                  value={simSearchQuery}
                  onChangeText={setSimSearchQuery}
                  containerStyle={styles.searchInput}
                  style={styles.searchInputField}
                />
                <TouchableOpacity style={styles.searchIconInside} onPress={() => console.log('Search pressed')}>
                  <Search size={18} color={Theme.Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.qrScanButton} onPress={handleQrScan}>
                <QrCode size={18} color={Theme.Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.simListHeader}>
              <Text style={styles.simListTitle}>Available SIM Cards</Text>
              <Text style={styles.simListCount}>{filteredSims.length} available</Text>
            </View>

            <FlatList
              data={filteredSims}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.simListContainer}
              style={styles.simFlatList}
              renderItem={({ item }) => {
                const isSelected = selectedSim === item.id;
                
                return (
                  <TouchableOpacity 
                    style={[
                      styles.simCard,
                      isSelected && styles.simCardSelected
                    ]}
                    onPress={() => setSelectedSim(item.id)}
                  >
                    <View style={styles.simCardContent}>
                      <View style={styles.simCardLeft}>
                        <View style={[
                          styles.simIcon,
                          isSelected && styles.simIconSelected
                        ]}>
                          <Smartphone size={20} color={isSelected ? Theme.Colors.white : Theme.Colors.primary} />
                        </View>
                        
                        <View style={styles.simInfo}>
                          <Text style={styles.simNumber}>{item.msisdn}</Text>
                          <Text style={styles.simId}>SIM: {item.sim}</Text>
                          <Text style={styles.simPukValue}>PUK: {item.puk}</Text>
                          <View style={styles.simStatusContainer}>
                            <View style={styles.simStatusDot} />
                            <Text style={styles.simStatusText}>{item.status}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.simCardRight}>
                        <View style={[
                          styles.simSelectCircle,
                          isSelected && styles.simSelectCircleSelected
                        ]}>
                          {isSelected && <Check size={16} color={Theme.Colors.white} />}
                        </View>
                      </View>
                    </View>
                    
                    {isSelected && (
                      <View style={styles.simSelectedBanner}>
                        <Text style={styles.simSelectedBannerText}>✓ Selected for onboarding</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        );

      case 'confirmation':
        const screenData = Dimensions.get('window');
        const signatureStyle = `
          .m-signature-pad--footer {
            display: none;
            margin: 0px;
          }
          body,html {
            width: 100%; height: 100%;
          }
          .m-signature-pad {
            position: fixed;
            font-size: 10px;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1000;
            user-select: none;
            touch-action: none;
            background-color: white;
            border: 2px solid #007AFF;
            border-radius: 8px;
          }
          .m-signature-pad--body {
            border: none;
          }
          .m-signature-pad--body canvas {
            border-radius: 6px;
          }
        `;
        
        const selectedPackageDetails = packages.find(pkg => pkg.id === selectedPackage);
        const selectedSimDetails = allSims.find(sim => sim.id === selectedSim);
        
        return (
          <ScrollView 
            style={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isSigningActive}
          >
            <View style={styles.summaryContainer}>

              
              {/* Customer KYC Information */}
              <View style={styles.summarySection}>
                <View style={styles.summarySectionHeader}>
                  <View style={styles.summaryIconContainer}>
                    <User size={20} color={Theme.Colors.primary} />
                  </View>
                  <Text style={styles.summaryTitle}>Customer KYC Information</Text>
                </View>
                <Text style={styles.summaryText}>Name: {customerDetails.name} {customerDetails.surname}</Text>
                <Text style={styles.summaryText}>Date of Birth: {customerDetails.dateOfBirth}</Text>
                <Text style={styles.summaryText}>Gender: {customerDetails.gender}</Text>
                <Text style={styles.summaryText}>ID Number: {customerDetails.idNumber}</Text>
                <Text style={styles.summaryText}>ID Expiration: {customerDetails.expirationDate}</Text>
                <Text style={styles.summaryText}>Customer Type: {customerDetails.customerType === 'gop-holder' ? 'GOP Holder' : customerDetails.customerType.charAt(0).toUpperCase() + customerDetails.customerType.slice(1)}</Text>
                {customerDetails.customerType === 'tourist' ? (
                  <Text style={styles.summaryText}>Nationality: {countries.find(c => c.id === customerDetails.country)?.name || 'Not specified'}</Text>
                ) : (
                  <>
                    <Text style={styles.summaryText}>District: {districts.find(d => d.id === customerDetails.district)?.name || 'Not specified'}</Text>
                    <Text style={styles.summaryText}>Sub-District: {subDistricts.find(sd => sd.id === customerDetails.subDistrict)?.name || 'Not specified'}</Text>
                  </>
                )}
              </View>
              
              {/* Selected Package */}
              <View style={styles.summarySection}>
                <View style={styles.summarySectionHeader}>
                  <View style={styles.summaryIconContainer}>
                    <Package size={20} color={Theme.Colors.primary} />
                  </View>
                  <Text style={styles.summaryTitle}>Selected Package</Text>
                </View>
                {selectedPackageDetails ? (
                  <>
                    <Text style={styles.summaryText}>Package: {selectedPackageDetails.name}</Text>
                    <Text style={styles.summaryText}>Price: {selectedPackageDetails.price}</Text>
                    <Text style={styles.summaryText}>Data: {selectedPackageDetails.data}</Text>
                    <Text style={styles.summaryText}>Calls: {selectedPackageDetails.calls}</Text>
                    <Text style={styles.summaryText}>SMS: {selectedPackageDetails.sms}</Text>
                    <Text style={styles.summaryText}>Validity: {selectedPackageDetails.validity}</Text>
                  </>
                ) : (
                  <Text style={styles.summaryText}>No package selected</Text>
                )}
              </View>
              
              {/* Selected Service (SIM) */}
              <View style={styles.summarySection}>
                <View style={styles.summarySectionHeader}>
                  <View style={styles.summaryIconContainer}>
                    <Smartphone size={20} color={Theme.Colors.primary} />
                  </View>
                  <Text style={styles.summaryTitle}>Selected Service</Text>
                </View>
                {selectedSimDetails ? (
                  <>
                    <Text style={styles.summaryText}>MSISDN: {selectedSimDetails.msisdn}</Text>
                    <Text style={styles.summaryText}>SIM Number: {selectedSimDetails.sim}</Text>
                    <Text style={styles.summaryText}>PUK: {selectedSimDetails.puk}</Text>
                    
                  </>
                ) : (
                  <Text style={styles.summaryText}>No SIM selected</Text>
                )}
              </View>
              
              {/* Confirmation Checkbox */}

              
              <View style={styles.signatureSection}>
                <View style={styles.summarySectionHeader}>
                  <View style={styles.summaryIconContainer}>
                    <FileText size={20} color={Theme.Colors.primary} />
                  </View>
                  <Text style={styles.summaryTitle}>Digital Signature</Text>
                </View>
                <Text style={styles.signatureInstructions}>
                  Please sign below to confirm and complete the onboarding process
                </Text>
                
                <View style={styles.signatureContainer}>
                  <SignatureScreen
                    ref={signatureRef}
                    onOK={handleSignature}
                    onEmpty={handleSignatureEmpty}
                    onBegin={handleSignatureBegin}
                    onEnd={handleSignatureEnd}
                    descriptionText=""
                    clearText="Clear"
                    confirmText="Save"
                    webStyle={signatureStyle}
                    autoClear={false}
                    imageType="image/png"
                    style={styles.signaturePad}
                  />
                </View>
                
                <View style={styles.signatureActions}>
                  <TouchableOpacity style={styles.clearButton} onPress={clearSignature}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={saveSignature}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
                
                {signature ? (
                  <View style={styles.signaturePreview}>
                    <Text style={styles.signaturePreviewText}>✓ Signature captured</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.confirmationSection}>
                <TouchableOpacity 
                  style={styles.checkboxContainer} 
                  onPress={() => setConfirmationVerified(!confirmationVerified)}
                >
                  <View style={[styles.checkbox, confirmationVerified && styles.checkboxChecked]}>
                    {confirmationVerified && <Check size={16} color={Theme.Colors.white} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I confirm that all information is accurate and verified. All customer KYC information, selected package, and selected service details have been reviewed and are correct.
                  </Text>
                </TouchableOpacity>
              </View>

              
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  if (showCamera) {
    const isScanning = currentStep === 'scan-id';
    const cameraAction = isScanning ? scanDocument : takePicture;
    const cameraTitle = isScanning ? 'Scan ID' : 'Capture Photo';
    
    return (
      <View style={styles.cameraFullScreen}>
        <Stack.Screen 
          options={{ 
            title: cameraTitle,
            headerStyle: {
              backgroundColor: Theme.Colors.primary,
            },
            headerTintColor: Theme.Colors.white,
            headerTitleStyle: {
              fontWeight: Theme.Typography.fontWeight.bold,
            },
          }} 
        />
        
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={'back' as CameraType}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraFrame}>
              <View style={styles.frameCorner} />
              <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
              <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
              <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
            </View>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shutterButton} onPress={cameraAction}>
                <View style={styles.shutterButtonInner} />
              </TouchableOpacity>
              
              <View style={styles.placeholder} />
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <BackgroundImage style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Digital Onboard',
          headerStyle: {
            backgroundColor: Theme.Colors.primary,
          },
          headerTintColor: Theme.Colors.white,
          headerTitleStyle: {
            fontWeight: Theme.Typography.fontWeight.bold,
          },
        }} 
      />
      
      <View style={styles.contentArea}>
        {renderStepIndicator()}
        {renderStepContent()}
      </View>

      <View style={[styles.navigationBar, { paddingBottom: Math.max(insets.bottom, Theme.Spacing.md) }]}>
        <Button
          title="Previous"
          onPress={handlePrevious}
          style={[styles.navButton, styles.prevButton]}
          textStyle={styles.navButtonText}
          disabled={isFirstStep}
        />
        
        <Button
          title={isLastStep ? 'Submit' : 'Continue'}
          onPress={isLastStep ? handleStepAction : handleNext}
          style={[
            styles.navButton, 
            styles.nextButton, 
            (
              (currentStep === 'capture-photo' && !capturedPhoto) || 
              (currentStep === 'scan-id' && !scannedId) ||
              (currentStep === 'customer-details' && (
                (customerDetails.customerType !== 'tourist' && (!customerDetails.district || !customerDetails.subDistrict)) ||
                (customerDetails.customerType === 'tourist' && !customerDetails.country) ||
                !detailsVerified
              )) ||
              (currentStep === 'package' && !selectedPackage) ||
              (currentStep === 'sim' && !selectedSim)
            ) && styles.nextButtonDisabled
          ]}
          textStyle={styles.navButtonTextPrimary}
          disabled={
            (currentStep === 'capture-photo' && !capturedPhoto) || 
            (currentStep === 'scan-id' && !scannedId) ||
            (currentStep === 'customer-details' && (
              (customerDetails.customerType !== 'tourist' && (!customerDetails.district || !customerDetails.subDistrict)) ||
              (customerDetails.customerType === 'tourist' && !customerDetails.country) ||
              !detailsVerified
            )) ||
            (currentStep === 'package' && !selectedPackage) ||
            (currentStep === 'sim' && !selectedSim) ||
            (currentStep === 'confirmation' && (!confirmationVerified || !signature))
          }
        />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  contentArea: {
    flex: 1,
    padding: Theme.Spacing.md,
    paddingBottom: 0,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.sm,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: Theme.Spacing.xs,
  },
  stepItemActive: {
    // Active step styling handled by circle and text
  },
  stepItemCompleted: {
    // Completed step styling handled by circle and text
  },
  stepItemDisabled: {
    opacity: 0.5,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: Theme.Colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: Theme.Colors.success,
  },
  stepNumber: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textSecondary,
  },
  stepNumberActive: {
    color: Theme.Colors.white,
  },
  stepTitle: {
    fontSize: Theme.Typography.fontSize.xs,
    textAlign: 'center',
    color: Theme.Colors.textSecondary,
    lineHeight: Theme.Typography.lineHeight.tight * Theme.Typography.fontSize.xs,
  },
  stepTitleActive: {
    color: Theme.Colors.primary,
  },
  stepTitleDisabled: {
    color: Theme.Colors.textTertiary,
  },
  stepContent: {
    flex: 1,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.sm,
    ...Theme.Shadows.md,
    marginBottom: 120,
  },

  stepBody: {
    flex: 1,
    minHeight: 0,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  featureList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginBottom: Theme.Spacing.sm,
    lineHeight: Theme.Typography.lineHeight.normal * Theme.Typography.fontSize.sm,
  },
  customerDetailsForm: {
    alignSelf: 'stretch',
    gap: Theme.Spacing.sm,
  },
  detailRow: {
    marginBottom: Theme.Spacing.sm,
  },
  detailLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
    marginBottom: Theme.Spacing.xs,
  },
  detailValue: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Theme.Colors.borderLight,
    borderRadius: Theme.BorderRadius.md,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
  },
  dropdownSection: {
    //marginTop: Theme.Spacing.md,
    //gap: Theme.Spacing.sm,
  },
  packageList: {
    alignSelf: 'stretch',
    gap: Theme.Spacing.xs,
  },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.md,
  },
  packageName: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  simList: {
    alignSelf: 'stretch',
    gap: Theme.Spacing.sm,
  },
  simItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.md,
    gap: Theme.Spacing.md,
  },
  simNumber: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.medium,
    flex: 1,
  },
  simStatus: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.success,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  summaryContainer: {
    alignSelf: 'stretch',
    gap: Theme.Spacing.lg,
  },
  summarySection: {
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.md,
  },
  summarySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
    gap: Theme.Spacing.sm,
  },
  summaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    flex: 1,
  },
  summaryText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginBottom: Theme.Spacing.xs,
  },
  confirmationTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  confirmationSection: {
    backgroundColor: Theme.Colors.warning + '10',
    borderRadius: Theme.BorderRadius.md,
    padding: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.warning + '30',
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.md,
    marginTop: Theme.Spacing.lg,
  },
  customerTypeSection: {
    marginBottom: Theme.Spacing.lg,
  },
  customerTypeOptions: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },
  customerTypeOption: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.md,
    borderWidth: 2,
    borderColor: Theme.Colors.borderLight,
    backgroundColor: Theme.Colors.surface,
    alignItems: 'center',
  },
  customerTypeOptionActive: {
    borderColor: Theme.Colors.primary,
    backgroundColor: Theme.Colors.primary + '10',
  },
  customerTypeText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
  },
  customerTypeTextActive: {
    color: Theme.Colors.primary,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  navigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.borderLight,
    gap: Theme.Spacing.md,
  },
  navButton: {
    flex: 1,
    height: 48,
  },
  prevButton: {
    backgroundColor: Theme.Colors.gray200,
  },
  nextButton: {
    backgroundColor: Theme.Colors.primary,
  },
  navButtonText: {
    color: Theme.Colors.textSecondary,
  },
  navButtonTextPrimary: {
    color: Theme.Colors.white,
  },
  photoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.lg,
  },
  photoFrame: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: Theme.Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoFrameCenter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: Theme.Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surfaceSecondary,
    position: 'relative',
  },
  photoFrameButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  photoPlaceholderText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginTop: Theme.Spacing.sm,
    textAlign: 'center',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    gap: Theme.Spacing.sm,
  },
  captureButtonText: {
    color: Theme.Colors.white,
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },

  capturedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.warning,
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    gap: Theme.Spacing.sm,
  },
  retakeButtonText: {
    color: Theme.Colors.white,
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  retakeButtonTextDisabled: {
    color: Theme.Colors.textSecondary,
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: Theme.Spacing.xl,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.lg,
    gap: Theme.Spacing.sm,
    minWidth: 140,
    justifyContent: 'center',
    marginTop: Theme.Spacing.lg,
  },
  actionButtonText: {
    color: Theme.Colors.white,
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  nextButtonDisabled: {
    backgroundColor: Theme.Colors.gray200,
    opacity: 0.6,
  },
  cameraFullScreen: {
    flex: 1,
    backgroundColor: Theme.Colors.black,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl,
  },
  cameraFrame: {
    width: 250,
    height: 300,
    position: 'relative',
    marginTop: Theme.Spacing.xl * 2,
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Theme.Colors.white,
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  frameCornerTopRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 0,
  },
  frameCornerBottomLeft: {
    bottom: 0,
    left: 0,
    top: 'auto',
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  frameCornerBottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Theme.Spacing.xl,
  },
  cancelButton: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
  },
  cancelButtonText: {
    color: Theme.Colors.white,
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Theme.Colors.gray300,
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.Colors.white,
  },
  placeholder: {
    width: 60,
  },
  scrollContainer: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Theme.Colors.border,
    borderRadius: 4,
    marginRight: Theme.Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surface,
  },
  checkboxChecked: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
  },
  checkboxText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
    flex: 1,
    lineHeight: Theme.Typography.lineHeight.normal * Theme.Typography.fontSize.sm,
  },
  packageCard: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.sm,
    marginBottom: Theme.Spacing.xs,
    borderWidth: 2,
    borderColor: Theme.Colors.borderLight,
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: Theme.Colors.primary,
    backgroundColor: Theme.Colors.primary + '10',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  packagePrice: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary,
  },
  packageDetails: {
    gap: Theme.Spacing.xs,
  },
  packageDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageDetailLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  packageDetailValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  selectedIndicator: {
    position: 'absolute',
    top: Theme.Spacing.md,
    right: Theme.Spacing.md,
  },
  simContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Theme.Spacing.lg,
    gap: Theme.Spacing.md,
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: Theme.Spacing.md,
    top: 36,
    zIndex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  searchInputField: {
    paddingRight: 45,
  },
  searchIconInside: {
    position: 'absolute',
    right: Theme.Spacing.sm,
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },
  qrButton: {
    width: 48,
    height: 48,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  simCard: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.sm,
    marginBottom: Theme.Spacing.xs,
    borderWidth: 2,
    borderColor: Theme.Colors.borderLight,
  },
  simCardSelected: {
    borderColor: Theme.Colors.primary,
    backgroundColor: Theme.Colors.primary + '10',
  },
  simCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  simDetails: {
    gap: Theme.Spacing.xs,
  },
  simDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simDetailLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
    minWidth: 60,
  },
  simDetailValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.medium,
    flex: 1,
    textAlign: 'right',
  },
  signatureSection: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.lg,
    marginTop: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.borderLight,
  },
  signatureInstructions: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginBottom: Theme.Spacing.lg,
    textAlign: 'center',
    lineHeight: Theme.Typography.lineHeight.normal * Theme.Typography.fontSize.sm,
  },
  signatureContainer: {
    height: 200,
    borderWidth: 2,
    borderColor: Theme.Colors.primary,
    borderRadius: Theme.BorderRadius.md,
    backgroundColor: Theme.Colors.white,
    marginBottom: Theme.Spacing.md,
    overflow: 'hidden',
  },
  signaturePad: {
    flex: 1,
  },
  signatureActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.Spacing.md,
  },
  clearButton: {
    flex: 1,
    backgroundColor: Theme.Colors.gray200,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.BorderRadius.md,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.white,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  signaturePreview: {
    marginTop: Theme.Spacing.md,
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.success + '20',
    borderRadius: Theme.BorderRadius.md,
    alignItems: 'center',
  },
  signaturePreviewText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.success,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  readOnlyInput: {
    marginBottom: 0,
  },
  documentFrame: {
    width: 350,
    height: 220,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 3,
    borderColor: Theme.Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  documentFrameCenter: {
    width: 350,
    height: 220,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 3,
    borderColor: Theme.Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surfaceSecondary,
    position: 'relative',
  },
  documentPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.BorderRadius.md,
  },
  placeholderImage: {
    width: '90%',
    height: '90%',
    borderRadius: 140,
    opacity: 0.3,
  },
  placeholderDocumentImage: {
    width: '90%',
    height: '90%',
    borderRadius: Theme.BorderRadius.md,
    opacity: 0.3,
  },
  
  // Package Selection Styles
  packageContainer: {
    flex: 1,
  },
  packageGrid: {
    gap: Theme.Spacing.sm,
  },
  packageCardCompact: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    borderWidth: 2,
    borderColor: Theme.Colors.borderLight,
    position: 'relative',
    marginBottom: Theme.Spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.08)',
      },
    }),
  },
  packageCardCompactSelected: {
    borderColor: Theme.Colors.primary,
    backgroundColor: Theme.Colors.primary + '08',
    ...Platform.select({
      ios: {
        shadowColor: Theme.Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
        borderWidth: 1,
        borderColor: Theme.Colors.primary,
      },
    }),
  },
  packageCardCompactPopular: {
    borderColor: Theme.Colors.warning,
    backgroundColor: Theme.Colors.warning + '05',
    ...Platform.select({
      ios: {
        shadowColor: Theme.Colors.warning,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
        borderWidth: 0.5,
        borderColor: Theme.Colors.warning,
      },
    }),
  },
  popularBadgeCompact: {
    position: 'absolute',
    top: -6,
    right: Theme.Spacing.md,
    backgroundColor: Theme.Colors.warning,
    paddingVertical: 4,
    paddingHorizontal: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.sm,
    zIndex: 1,
  },
  popularBadgeCompactText: {
    fontSize: 10,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.white,
    letterSpacing: 0.5,
  },
  packageCardCompactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.xs,
  },
  packageNameCompact: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    flex: 1,
  },
  packageSelectCircleCompact: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Theme.Colors.border,
    backgroundColor: Theme.Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageSelectCircleCompactSelected: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
  },
  packagePriceCompact: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary,
    marginBottom: Theme.Spacing.sm,
  },
  packageFeaturesCompact: {
    gap: 6,
  },
  packageFeatureRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageFeatureLabelCompact: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
    flex: 1,
  },
  packageFeatureValueCompact: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    textAlign: 'right',
    flex: 1,
  },
  packageSelectedIndicator: {
    backgroundColor: Theme.Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.sm,
    alignItems: 'center',
    marginTop: Theme.Spacing.sm,
  },
  packageSelectedText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.white,
    letterSpacing: 0.5,
  },
  
  // SIM Selection Styles
  simHeader: {
    alignItems: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  simHeaderTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
    marginTop: Theme.Spacing.sm,
  },
  simHeaderSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.Spacing.xs,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm,
    marginBottom: Theme.Spacing.md,
  },
  qrScanButton: {
    width: 48,
    height: 48,
    backgroundColor: Theme.Colors.primary,
    borderRadius: Theme.BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  simListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  simListTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
  },
  simListCount: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    backgroundColor: Theme.Colors.gray100,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.sm,
  },
  simListContainer: {
    paddingBottom: Theme.Spacing.lg,
  },
  simCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  simCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Theme.Spacing.sm,
  },
  simIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simIconSelected: {
    backgroundColor: Theme.Colors.primary,
  },
  simInfo: {
    flex: 1,
  },
  simId: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textTertiary,
    marginTop: 2,
  },
  simStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.xs,
    marginTop: Theme.Spacing.xs,
  },
  simStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.Colors.success,
  },
  simStatusText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.success,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  simCardRight: {
    alignItems: 'center',
    gap: Theme.Spacing.xs,
  },
  simSelectCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Theme.Colors.border,
    backgroundColor: Theme.Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simSelectCircleSelected: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
  },
  simPukValue: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
    marginTop: 2,
  },
  simSelectedBanner: {
    backgroundColor: Theme.Colors.success + '15',
    paddingVertical: Theme.Spacing.xs,
    paddingHorizontal: Theme.Spacing.sm,
    marginTop: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.sm,
    alignItems: 'center',
  },
  simSelectedBannerText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.success,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  packageScrollContent: {
    paddingBottom: Theme.Spacing.lg,
  },
  simFlatList: {
    flex: 1,
  },
});