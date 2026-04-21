import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const styles = StyleSheet.create({

  // ── COMMON ──────────────────────────────────────────────────────────────

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
    backgroundColor: COLORS.white,
  },
  screenHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: COLORS.black,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.gray400,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray600,
  },
  optional: {
    fontWeight: '400',
    color: COLORS.gray400,
  },

  // Shared chip
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray50,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  chipActive: {
    backgroundColor: COLORS.purple50,
    borderColor: COLORS.purple200,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.gray600,
    fontWeight: '400',
  },
  chipTextActive: {
    color: COLORS.purple800,
    fontWeight: '500',
  },

  // Shared primary button
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.purple600,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
  },
  primaryBtnDisabled: {
    backgroundColor: COLORS.gray100,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '500',
  },

  // Shared outline button
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    borderWidth: 0.5,
    borderColor: COLORS.purple400,
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
  },
  outlineBtnText: {
    fontSize: 14,
    color: COLORS.purple600,
    fontWeight: '500',
  },

  // Shared text input
  textInput: {
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.black,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: COLORS.gray50,
  },

  // Shared modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray100,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  modalContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  cancelText: {
    fontSize: 14,
    color: COLORS.purple600,
  },

  // Shared badges
  typeBadge: {
    backgroundColor: COLORS.purple50,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  typeBadgeText: {
    fontSize: 13,
    color: COLORS.purple800,
    fontWeight: '500',
  },
  colorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  colorBadgeText: {
    fontSize: 13,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },

  // Shared empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── WARDROBE SCREEN ─────────────────────────────────────────────────────

  wardrobeFilterScroll: {
    flexGrow: 0,
  },
  wardrobeFilterRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: SPACING.xs,
    flexDirection: 'row',
  },
  wardrobeScroll: {
    flex: 1,
  },
  wardrobeScrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  wardrobeSection: {
    marginBottom: SPACING.lg,
  },
  wardrobeSectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray600,
    marginBottom: SPACING.sm,
  },
  wardrobeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  // ── CAMERA SCREEN ───────────────────────────────────────────────────────

  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  camTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  camIconBtn: {
    padding: SPACING.sm,
  },
  camHintPill: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
  },
  camHintText: {
    color: COLORS.white,
    fontSize: 12,
  },
  viewfinder: {
    position: 'absolute',
    top: '25%',
    left: '12%',
    right: '12%',
    bottom: '25%',
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: 2.5, borderLeftWidth: 2.5,
    borderColor: COLORS.purple200,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: 2.5, borderRightWidth: 2.5,
    borderColor: COLORS.purple200,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: 2.5, borderLeftWidth: 2.5,
    borderColor: COLORS.purple200,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: 2.5, borderRightWidth: 2.5,
    borderColor: COLORS.purple200,
    borderBottomRightRadius: 4,
  },
  shutterArea: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    paddingBottom: SPACING.xl + 8,
  },
  shutter: {
    width: 68, height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.white,
  },
  permTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
  },
  permSub: {
    fontSize: 14,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },
  permBtn: {
    backgroundColor: COLORS.purple600,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  permBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '500',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray100,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  previewScroll: {
    flex: 1,
  },
  previewScrollContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  previewImage: {
    width: '100%',
    height: 240,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.lg,
  },
  typeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray50,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  typeChipActive: {
    backgroundColor: COLORS.purple50,
    borderColor: COLORS.purple400,
  },
  typeChipText: {
    fontSize: 13,
    color: COLORS.gray600,
  },
  typeChipTextActive: {
    color: COLORS.purple800,
    fontWeight: '500',
  },
  colorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorHint: {
    fontSize: 11,
    color: COLORS.gray400,
    flex: 1,
    textAlign: 'right',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray50,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  colorOptionSelected: {
    backgroundColor: COLORS.purple50,
    borderColor: COLORS.purple400,
  },
  colorOptionLabel: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  colorOptionLabelSelected: {
    color: COLORS.purple800,
    fontWeight: '500',
  },

  // ── OUTFITS SCREEN ──────────────────────────────────────────────────────

  outfitsTabRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  outfitsScroll: {
    flex: 1,
  },
  outfitsScrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  outfitGeneratedCard: {
    backgroundColor: COLORS.purple50,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    minHeight: 200,
    justifyContent: 'center',
  },
  outfitGeneratedTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.purple800,
    marginBottom: SPACING.md,
  },
  outfitSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  outfitSlotWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  outfitSlot: {
    width: '90%',
    aspectRatio: 0.8,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.purple100,
  },
  outfitSlotImage: {
    width: '100%',
    height: '100%',
  },
  outfitSlotEmptyText: {
    fontSize: 10,
    color: COLORS.gray200,
  },
  outfitSlotLabel: {
    fontSize: 11,
    color: COLORS.purple600,
    fontWeight: '500',
  },
  outfitActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  outfitActionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: COLORS.purple600,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
  },
  outfitActionSaved: {
    backgroundColor: COLORS.teal600,
  },
  outfitActionSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: COLORS.purple400,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
  },
  outfitActionTextPrimary: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
  },
  outfitActionTextSecondary: {
    color: COLORS.purple600,
    fontSize: 13,
    fontWeight: '500',
  },
  outfitGeneratingState: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  outfitGeneratingText: {
    fontSize: 14,
    color: COLORS.purple600,
  },
  outfitEmptySlots: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  outfitEmptySlot: {
    width: 72,
    height: 88,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.purple100,
    opacity: 0.6,
  },
  outfitEmptyText: {
    fontSize: 13,
    color: COLORS.purple400,
    textAlign: 'center',
  },
  outfitEmptyWrap: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.purple600,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    marginBottom: SPACING.sm,
  },
  generateBtnDisabled: {
    backgroundColor: COLORS.gray100,
  },
  generateBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '500',
  },
  generateHintText: {
    fontSize: 12,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 20,
  },
  savedEmptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    gap: SPACING.sm,
  },
  savedEmptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  savedEmptyText: {
    fontSize: 14,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── CLOTHING ITEM COMPONENT ─────────────────────────────────────────────

  itemCard: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  itemColorDotWrap: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  colorDot: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotHalf: {
    flex: 1,
    height: '100%',
  },
  itemModalImageWrap: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemModalImage: {
    width: '100%',
    height: '100%',
  },
  itemModalImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  itemDescriptionBox: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  itemDescriptionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemDescriptionText: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 22,
  },
  itemDescriptionEmpty: {
    fontSize: 14,
    color: COLORS.gray200,
    fontStyle: 'italic',
  },
  itemDateText: {
    fontSize: 12,
    color: COLORS.gray400,
    textAlign: 'center',
  },
  colorPickerWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  colorPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray50,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  colorPickerItemSelected: {
    backgroundColor: COLORS.purple50,
    borderColor: COLORS.purple400,
  },
  colorPickerLabel: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  colorPickerLabelSelected: {
    color: COLORS.purple800,
    fontWeight: '500',
  },

  // ── OUTFIT CARD COMPONENT ───────────────────────────────────────────────

  outfitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  outfitCardSlots: {
    flexDirection: 'row',
    gap: 4,
  },
  outfitCardSlot: {
    width: 44,
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  outfitCardSlotImage: {
    width: '100%',
    height: '100%',
  },
  outfitCardMeta: {
    flex: 1,
    gap: 3,
  },
  outfitCardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.black,
  },
  outfitCardDate: {
    fontSize: 10,
    color: COLORS.gray400,
  },
  outfitCardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.teal50,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginTop: 2,
  },
  outfitCardBadgeText: {
    fontSize: 9,
    color: COLORS.teal600,
    fontWeight: '500',
  },
  outfitCardDeleteBtn: {
    padding: SPACING.xs,
  },

});

export default styles;