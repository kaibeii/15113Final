import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../constants/theme';

const styles = StyleSheet.create({

  // ── COMMON ──────────────────────────────────────────────────────────────

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
    backgroundColor: COLORS.background,
  },
  screenHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  screenTitle: {
    fontSize: 30,
    fontFamily: FONTS.heading,
    color: COLORS.black,
    letterSpacing: 0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: COLORS.gray400,
    marginTop: 3,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.gray600,
    letterSpacing: 0.2,
  },
  optional: {
    fontFamily: FONTS.light,
    color: COLORS.gray400,
  },

  // Consolidated: empty state titles and text
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.black,
    letterSpacing: 0.2,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.light,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Consolidated: uppercase label used across wardrobe, item detail, outfit modal
  uppercaseLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Consolidated: base card used across item cards, outfit cards, modal items
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
  },

  // Shared chip
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  chipActive: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  chipText: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: COLORS.gray600,
  },
  chipTextActive: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },

  // Shared primary button — black
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
  },
  primaryBtnDisabled: {
    backgroundColor: COLORS.gray100,
  },
  primaryBtnText: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // Shared outline button
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    borderWidth: 0.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.lg,
    paddingVertical: 13,
  },
  outlineBtnText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },

  // Shared text input
  textInput: {
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    fontFamily: FONTS.light,
    color: COLORS.black,
    minHeight: 88,
    textAlignVertical: 'top',
    backgroundColor: COLORS.white,
  },

  // Shared modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.gray100,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: FONTS.heading,
    color: COLORS.black,
    letterSpacing: 0.2,
  },
  modalContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: FONTS.light,
    color: COLORS.gray600,
  },

  // Shared badges
  typeBadge: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
  },
  typeBadgeText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  colorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  colorBadgeText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.gray600,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },

  // Shared empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },

  // ── TAB BAR ─────────────────────────────────────────────────────────────

  tabBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    borderTopWidth: 0.3,
    borderTopColor: COLORS.gray100,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: SPACING.xs,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: FONTS.light,
    color: COLORS.gray400,
  },
  tabLabelActive: {
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  plusWrap: {
    flex: 0.8,
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  plusBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    marginTop: -22,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  plusBtnActive: {
    backgroundColor: COLORS.primarySoft,
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
    // uses uppercaseLabel — referenced directly in component
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    backgroundColor: COLORS.black,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  camTopBarContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  camHintText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.light,
  },
  viewfinder: {
    position: 'absolute',
    top: '25%',
    left: '12%',
    right: '12%',
    bottom: '25%',
    zIndex: 10,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderColor: COLORS.white,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: 2, borderRightWidth: 2,
    borderColor: COLORS.white,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: 2, borderLeftWidth: 2,
    borderColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderColor: COLORS.white,
    borderBottomRightRadius: 4,
  },
  shutterArea: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    paddingBottom: SPACING.xl + 8,
    zIndex: 10,
  },
  shutter: {
    width: 72, height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
  },
  permTitle: {
    fontSize: 20,
    fontFamily: FONTS.heading,
    color: COLORS.black,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  permSub: {
    fontSize: 14,
    fontFamily: FONTS.light,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },
  permBtn: {
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  permBtnText: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
    fontSize: 15,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.gray100,
  },
  previewTitle: {
    fontSize: 17,
    fontFamily: FONTS.heading,
    color: COLORS.black,
    letterSpacing: 0.2,
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
    height: 260,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
  },
  typeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  typeChipActive: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  typeChipText: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: COLORS.gray600,
  },
  typeChipTextActive: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  colorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorHint: {
    fontSize: 11,
    fontFamily: FONTS.light,
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
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  colorOptionSelected: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  colorOptionLabel: {
    fontSize: 12,
    fontFamily: FONTS.light,
    color: COLORS.gray600,
  },
  colorOptionLabelSelected: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },

  // ── OUTFITS SCREEN ──────────────────────────────────────────────────────

  outfitsScroll: {
    flex: 1,
  },
  outfitsScrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  outfitGeneratedCard: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    minHeight: 200,
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
  },
  outfitGeneratedTitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray600,
    marginBottom: SPACING.md,
    letterSpacing: 0.2,
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
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
  },
  outfitSlotImage: {
    width: '100%',
    height: '100%',
  },
  outfitSlotEmptyText: {
    fontSize: 10,
    fontFamily: FONTS.light,
    color: COLORS.gray200,
  },
  outfitSlotLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.gray600,
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
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.md,
    paddingVertical: 11,
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
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.md,
    paddingVertical: 11,
  },
  outfitActionTextPrimary: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
    fontSize: 13,
  },
  outfitActionTextSecondary: {
    fontFamily: FONTS.medium,
    color: COLORS.black,
    fontSize: 13,
  },
  outfitGeneratingState: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  outfitGeneratingText: {
    fontSize: 14,
    fontFamily: FONTS.light,
    color: COLORS.gray600,
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
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
    opacity: 0.6,
  },
  outfitEmptyText: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: COLORS.gray400,
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
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    marginBottom: SPACING.sm,
  },
  generateBtnDisabled: {
    backgroundColor: COLORS.gray100,
  },
  generateBtnText: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  generateHintText: {
    fontSize: 12,
    fontFamily: FONTS.light,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 20,
  },
  savedSection: {
    marginTop: SPACING.xl,
  },
  savedSectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.black,
    marginBottom: SPACING.md,
    letterSpacing: 0.2,
  },

  // ── CLOTHING ITEM COMPONENT ─────────────────────────────────────────────

  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.3,
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
    bottom: 6,
    right: 6,
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
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
  },
  itemDescriptionText: {
    fontSize: 15,
    fontFamily: FONTS.light,
    color: COLORS.black,
    lineHeight: 23,
  },
  itemDescriptionEmpty: {
    fontSize: 14,
    fontFamily: FONTS.light,
    color: COLORS.gray200,
    fontStyle: 'italic',
  },
  itemDateText: {
    fontSize: 12,
    fontFamily: FONTS.light,
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
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  colorPickerItemSelected: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  colorPickerLabel: {
    fontSize: 12,
    fontFamily: FONTS.light,
    color: COLORS.gray600,
  },
  colorPickerLabelSelected: {
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },

  // ── OUTFIT CARD COMPONENT ───────────────────────────────────────────────

  outfitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
  },
  outfitCardSlots: {
    flexDirection: 'row',
    gap: 4,
  },
  outfitCardSlot: {
    width: 46,
    height: 54,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
    overflow: 'hidden',
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
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  outfitCardDate: {
    fontSize: 11,
    fontFamily: FONTS.light,
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
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.teal600,
  },
  outfitCardDeleteBtn: {
    padding: SPACING.xs,
  },

  // ── OUTFIT MODAL ────────────────────────────────────────────────────────

  outfitModalTitle: {
    fontSize: 22,
    fontFamily: FONTS.heading,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  outfitModalDate: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: COLORS.gray400,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  outfitModalItems: {
    gap: SPACING.lg,
  },
  outfitModalItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 0.3,
    borderColor: COLORS.gray100,
    gap: SPACING.md,
  },
  outfitModalItemImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  outfitModalItemImageContent: {
    width: '100%',
    height: '100%',
  },
  outfitModalItemMeta: {
    flex: 1,
    gap: SPACING.xs,
  },
  outfitModalItemType: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  outfitModalItemColor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  outfitModalItemColorText: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: COLORS.gray600,
  },
  outfitModalItemDescription: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  outfitModalItemEmpty: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: COLORS.gray400,
    fontStyle: 'italic',
  },

});

export default styles;