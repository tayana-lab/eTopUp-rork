import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Theme } from '@/constants/theme';

interface DropdownOption {
  id: string;
  name: string;
}

interface DropdownProps {
  title: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Dropdown({
  title,
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  disabled = false,
}: DropdownProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const selectedOption = options.find(option => option.id === selectedValue);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  const renderOption = ({ item }: { item: DropdownOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.id === selectedValue && styles.selectedOption,
      ]}
      onPress={() => handleSelect(item.id)}
    >
      <Text
        style={[
          styles.optionText,
          item.id === selectedValue && styles.selectedOptionText,
        ]}
      >
        {item.name}
      </Text>
      {item.id === selectedValue && (
        <Check size={20} color={Theme.Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        style={[
          styles.dropdown,
          disabled && styles.dropdownDisabled,
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedOption && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {selectedOption ? selectedOption.name : placeholder}
        </Text>
        <ChevronDown
          size={20}
          color={disabled ? Theme.Colors.textTertiary : Theme.Colors.textSecondary}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {title}</Text>
            </View>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.id}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.Spacing.md,
  },
  title: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
    marginBottom: Theme.Spacing.xs,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    minHeight: Theme.Layout.inputHeight,
  },
  dropdownDisabled: {
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderColor: Theme.Colors.borderLight,
    opacity: 0.6,
  },
  dropdownText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: Theme.Colors.textTertiary,
  },
  disabledText: {
    color: Theme.Colors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.Spacing.lg,
  },
  modalContent: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    width: '100%',
    maxHeight: '70%',
    ...Theme.Shadows.lg,
  },
  modalHeader: {
    padding: Theme.Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  modalTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  selectedOption: {
    backgroundColor: Theme.Colors.primary + '10',
  },
  optionText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    flex: 1,
  },
  selectedOptionText: {
    color: Theme.Colors.primary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
});