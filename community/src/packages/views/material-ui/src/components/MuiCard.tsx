import type {CardProps} from '@mui/material'
import {Card, CardActionArea as RawActionArea, CardActions, CardContent, CardHeader, CardMedia} from '@mui/material'
import {boolean, define, disabled, event, node, oneOf, readOnly, useBuilderMode} from '@react-form-builder/core'
import type {PropsWithChildren, ReactNode} from 'react'
import {useMemo} from 'react'
import {surfacesCategory} from './categories'
import type {DisabledProps} from './internal/DisabledProps'
import type {ReadOnlyProps} from './internal/ReadOnlyProps'

/**
 * Props for the MuiCard component.
 */
export interface MuiCardProps extends CardProps, DisabledProps, ReadOnlyProps {
  /**
   * Whether to show the card header.
   */
  useHeader?: boolean
  /**
   * Whether to show header action area.
   */
  useHeaderAction?: boolean
  /**
   * Whether to show header avatar.
   */
  useHeaderAvatar?: boolean
  /**
   * Whether to show subheader.
   */
  useSubheader?: boolean
  /**
   * Whether to show media section.
   */
  useMedia?: boolean
  /**
   * Whether to show actions section.
   */
  useActions?: boolean
  /**
   * Whether to use card action area wrapper.
   */
  useCardActionArea?: boolean
  /**
   * Header content to display.
   */
  header: ReactNode
  /**
   * Header avatar content.
   */
  headerAvatar: ReactNode
  /**
   * Header action content.
   */
  headerAction: ReactNode
  /**
   * Subheader content.
   */
  subHeader: ReactNode
  /**
   * Media content.
   */
  media: ReactNode
  /**
   * Actions content.
   */
  actions: ReactNode
}

/**
 * Custom hook to process card props and separate them into logical groups.
 * @param props card component properties.
 * @returns processed card properties organized by section.
 */
const useCardProps = (props: MuiCardProps) => {
  return useMemo(() => {
    const {
      children,
      useHeader,
      useHeaderAction,
      useHeaderAvatar,
      useSubheader,
      useMedia,
      useActions,
      useCardActionArea,
      header,
      headerAction,
      headerAvatar,
      subHeader,
      media,
      actions,
      disabled,
      readOnly,
      ...card
    } = props

    return {
      actions: {
        useActions,
        actions
      },
      header: {
        useHeader,
        useHeaderAction,
        useHeaderAvatar,
        useSubheader,
        header,
        headerAction,
        headerAvatar,
        subHeader
      },
      media: {
        useMedia,
        media
      },
      children,
      useCardActionArea,
      card
    }
  }, [props])
}

/**
 * Type representing the processed card properties returned by useCardProps.
 */
type FilteredProps = ReturnType<typeof useCardProps>

const CardActionArea = ({children}: PropsWithChildren) => {
  const builderMode = useBuilderMode()
  return builderMode === 'builder'
    ? <div>{children}</div>
    : <RawActionArea>{children}</RawActionArea>
}

/**
 * Renders the main content area of the card.
 * @param useCardActionArea whether to wrap content in CardActionArea.
 * @param children content to render.
 * @returns the rendered content.
 */
const renderContent = (useCardActionArea: boolean, children: ReactNode) => {
  if (useCardActionArea) return <CardActionArea>{children}</CardActionArea>
  return <>{children}</>
}

/**
 * Renders the card header section.
 * @param headerProps header configuration and content.
 * @param headerProps.useHeader whether to show the card header.
 * @param headerProps.useHeaderAction whether to show header action area.
 * @param headerProps.useHeaderAvatar whether to show header avatar.
 * @param headerProps.useSubheader whether to show subheader.
 * @param headerProps.header header content to display.
 * @param headerProps.headerAction header action content.
 * @param headerProps.headerAvatar header avatar content.
 * @param headerProps.subHeader subheader content.
 * @returns rendered header or null.
 */
const renderHeader = ({
                        useHeader,
                        useHeaderAction,
                        useHeaderAvatar,
                        useSubheader,
                        header,
                        headerAction,
                        headerAvatar,
                        subHeader
                      }: FilteredProps['header']) => {
  return useHeader && !!header && <CardHeader
    title={header}
    action={useHeaderAction && headerAction}
    avatar={useHeaderAvatar && headerAvatar}
    subheader={useSubheader && subHeader}
  />
}

/**
 * Renders the card media section.
 * @param mediaProps media configuration and content.
 * @param mediaProps.useMedia whether to show media section.
 * @param mediaProps.media media content.
 * @returns rendered media or null.
 */
const renderMedia = ({useMedia, media}: FilteredProps['media']) => (
  useMedia && !!media && <CardMedia>{media}</CardMedia>
)

/**
 * Renders the card actions section.
 * @param actionsProps actions configuration and content.
 * @param actionsProps.useActions whether to show actions section.
 * @param actionsProps.actions actions content.
 * @returns rendered actions or null.
 */
const renderActions = ({useActions, actions}: FilteredProps['actions']) => (
  useActions && !!actions && <CardActions>{actions}</CardActions>
)

/**
 * Material-UI Card component for form builder.
 * @param props component properties.
 * @returns card component.
 */
const MuiCard = (props: MuiCardProps) => {
  const {card, children, header, media, actions, useCardActionArea} = useCardProps(props)

  return (
    <Card {...card}>
      {renderContent(!!useCardActionArea, <>
        {renderHeader(header)}
        {renderMedia(media)}
        <CardContent>{children}</CardContent>
        {renderActions(actions)}
      </>)}
    </Card>
  )
}

export const muiCard = define(MuiCard, 'MuiCard')
  .icon('Card')
  .category(surfacesCategory)
  .props({
    useHeader: boolean,
    useHeaderAction: boolean,
    useHeaderAvatar: boolean,
    useSubheader: boolean,
    useMedia: boolean,
    useActions: boolean,
    useCardActionArea: boolean,
    header: node,
    headerAction: node,
    headerAvatar: node,
    subHeader: node,
    media: node,
    actions: node,
    children: node,
    variant: oneOf('elevation', 'outlined'),
    onSelect: event,
    disabled: disabled,
    readOnly: readOnly
  })
