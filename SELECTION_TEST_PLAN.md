# Task Selection Feature Test Plan

## Desktop Mode (AG-Grid)

### Test Cases:
1. **Single Selection**
   - Click checkbox next to a task
   - Verify task is selected (highlighted)
   - Verify selectedTaskIds state is updated

2. **Multiple Selection**
   - Select multiple tasks using checkboxes
   - Verify all selected tasks are highlighted
   - Verify count in selection state

3. **Select All**
   - Click header checkbox
   - Verify all visible tasks are selected
   - Test with filtered data

4. **Deselection**
   - Click selected checkbox to deselect
   - Verify task is no longer highlighted

5. **Action Integration**
   - Select tasks
   - Verify action buttons in toolbar are enabled
   - Click action button and verify selected task IDs are passed

## Mobile Mode (iOS Pattern)

### Test Cases:
1. **Enter Selection Mode**
   - Long press (500ms) on any task
   - Verify haptic feedback (if supported)
   - Verify selection mode UI appears
   - Verify pressed task is selected

2. **Selection Mode UI**
   - Verify header changes to show "X Selected"
   - Verify "Cancel" and "Select All" buttons appear
   - Verify circular checkboxes appear on all tasks

3. **Multiple Selection in Selection Mode**
   - Tap additional tasks while in selection mode
   - Verify selection count updates
   - Verify visual feedback (blue border, checkbox)

4. **Select All**
   - Tap "Select All" button
   - Verify all visible tasks are selected

5. **Exit Selection Mode**
   - Tap "Cancel" button
   - Verify selection mode UI disappears
   - Verify all selections are cleared

6. **Action Sheet**
   - Select one or more tasks
   - Verify floating action button appears
   - Tap action button
   - Verify action sheet shows with:
     - Correct count of selected tasks
     - All 5 action options
     - Cancel button
   - Test each action logs correct task IDs

7. **Normal Navigation**
   - Verify regular tap (not long press) still opens task details
   - Verify selection mode doesn't interfere with normal navigation

## Cross-Platform Consistency

1. **State Synchronization**
   - Switch between mobile and desktop views
   - Verify selection state is maintained (if applicable)

2. **Action Consistency**
   - Verify same actions available in both modes
   - Verify action handlers work identically

## Edge Cases

1. **Empty Selection**
   - Try to open action sheet with no selection
   - Verify appropriate handling

2. **Performance**
   - Test with large number of tasks
   - Verify selection performance is smooth

3. **Touch Gestures**
   - Test accidental touches
   - Test touch move (should cancel long press)
   - Test rapid taps

## Visual Testing

1. **Dark Mode**
   - Test all selection UI in dark mode
   - Verify contrast and visibility

2. **Responsive Design**
   - Test at various screen sizes
   - Verify UI adapts appropriately