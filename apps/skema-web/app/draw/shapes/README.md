# Rectangle Manager

This directory contains specialized shape managers that extract and consolidate shape-specific logic from the main `draw.ts` file.

## RectangleManager

The `RectangleManager` class consolidates all rectangle-related operations that were previously scattered throughout the `Game` class.

### Features

- **Unified Shape Generation**: Single `RectangleHelper.generateShapeData()` method handles both round and sharp edge rectangles
- **Performance Optimization**: Built-in throttling and deduplication for preview rendering
- **Error Handling**: Robust validation and error recovery for all operations
- **Memory Management**: Shape data caching and cleanup mechanisms
- **Type Safety**: Full TypeScript support with proper type validation

### API

#### Creation

```typescript
createMessage(startX, startY, w, h, props, seed?) -> Message
```

#### Rendering

```typescript
render(message) -> void
renderPreview(startX, startY, w, h, props, previewId, previewSeed) -> void
```

#### Interaction

```typescript
handleDrag(message, currentPos, previousPos, setSelectedMessage) -> void
handleResize(message, currentPos, previousPos, resizeHandler, setSelectedMessage, updateCursor) -> {newHandler}
updateProperties(message, newProps, setSelectedMessage) -> void
```

#### Utilities

```typescript
cleanup() -> void
```

### Replaced Functions

The RectangleManager replaces these functions from the original `draw.ts`:

- `messageRect()` → `createMessage()`
- `drawRect()` → `render()`
- `drawMovingRect()` → `renderPreview()`
- `handleRectangleDrag()` → `handleDrag()`
- `handleRectangleResize()` → `handleResize()`
- `handleRectanglePropsChange()` → `updateProperties()`

### Benefits

1. **Code Reduction**: Eliminated ~200 lines of duplicated edge-handling logic
2. **Performance**: Built-in throttling prevents socket flooding during preview
3. **Maintainability**: All rectangle logic centralized in one class
4. **Extensibility**: Easy to add new rectangle features (aspect ratio lock, snapping, etc.)
5. **Testing**: Isolated logic makes unit testing straightforward

### Future Enhancements

The architecture supports easy addition of:

- Aspect ratio locking during resize
- Smart snapping to grid/other shapes
- Multi-select operations
- Rotation capabilities
- Dynamic corner radius adjustment

## Usage in Game Class

```typescript
// Initialization
this.rectangleManager = new RectangleManager(
	ctx,
	rc,
	generator,
	socket,
	theme,
	roomId,
	userId
);

// Usage
const message = this.rectangleManager.createMessage(
	startX,
	startY,
	w,
	h,
	props
);
this.rectangleManager.render(message);
this.rectangleManager.handleDrag(message, pos, prevPos, setSelectedMessage);
```

## Architecture

The shapes directory follows a manager pattern where each shape type gets its own dedicated manager class. This allows for:

- Shape-specific optimizations
- Independent feature development
- Clear separation of concerns
- Easier testing and maintenance

Future shape managers will follow the same pattern:

- `EllipseManager`
- `LineManager`
- `RhombusManager`
- `PencilManager`
- etc.
