# Select

A customizable, accessible, and flexible select component built for React. It supports single and multiple selection, search, virtualized lists, custom rendering, and portaled dropdowns.

> [!NOTE]
> _More features might be added in the future!_

## Anatomy

Import the components and assemble its pieces:

```tsx
import { Select } from "fransiscushermanto/ui"; // Or your relative path

export default () => (
  <Select.Root options={[]}>
    <Select.Trigger>
      <Select.Value />
      <Select.Icon />
    </Select.Trigger>
    <Select.Portal>
      <Select.Dropdown>
        {({ label, value }) => (
          <Select.Item key={value} value={value}>
            {label}
          </Select.Item>
        )}
      </Select.Dropdown>
    </Select.Portal>
  </Select.Root>
);
```

## Usage

### Basic Use

Provide an array of options to `Select.Root`.

```tsx
import { Select } from "fransiscushermanto/ui";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
];

export const BasicSelect = () => (
  <Select.Root options={options}>
    <Select.Trigger>
      <Select.Value placeholder="Select a fruit" />
      <Select.Icon />
    </Select.Trigger>
    <Select.Dropdown>
      {({ label, value }) => (
        <Select.Item key={value} value={value}>
          {label}
        </Select.Item>
      )}
    </Select.Dropdown>
  </Select.Root>
);
```

### Multiple Selection

Use the `multiple` prop to allow selecting multiple options.

```tsx
<Select.Root options={options} multiple>
```

### Searchable & Virtualized

By default, the select component is both searchable and virtualized for performance on large lists. You can easily toggle these values:

```tsx
<Select.Root
  options={options}
  searchable={false}
  virtualized={false}
>
```

### Controlled Component

You can control the select value by providing `value` and `onChange` props to `Select.Root`.

```tsx
const [value, setValue] = useState<string | number>();

const handleChange = (option) => {
  setValue(option.value);
};

return (
  <Select.Root options={options} value={value} onChange={handleChange}>
    {/* ... trigger and dropdown elements */}
  </Select.Root>
);
```

### Custom Content & Multi-Value Tags

You can customize how options are rendered in both the dropdown list and the trigger value area using `renderLabel` and `renderMultiValueTag`.

```tsx
<Select.Root options={options}>
  <Select.Trigger>
    <Select.Value
      renderLabel={({ label, icon }) => (
        <div className="flex items-center gap-2">
          <img src={icon} alt="" className="w-5 h-5" />
          <span>{label}</span>
        </div>
      )}
      renderMultiValueTag={(option, props) => (
        <div
          key={option.value}
          className="flex items-center gap-2 bg-gray-100 px-2 py-1"
          {...props.getTagRootProps()}
        >
          <span>{option.label}</span>
          <button
            {...props.getTagDeleteButtonProps({
              onClick: () => props.onDeleteValue(option),
            })}
          >
            x
          </button>
        </div>
      )}
      placeholder="Select an option"
    />
    <Select.Icon />
  </Select.Trigger>

  {/* Custom dropdown elements */}
  <Select.Dropdown>
    {({ label, value, icon }) => (
      <Select.Item key={value} value={value}>
        <img src={icon} alt="" className="w-5 h-5" />
        <span>{label}</span>
      </Select.Item>
    )}
  </Select.Dropdown>
</Select.Root>
```

### Portaled Dropdown

Use `<Select.Portal>` to render the dropdown inside a React Portal. This is especially useful for rendering dropdowns outside of their parent container's `overflow: hidden` constraints.

```tsx
<Select.Root options={options}>
  <Select.Trigger>
    <Select.Value placeholder="Select" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Dropdown>{/* ... */}</Select.Dropdown>
  </Select.Portal>
</Select.Root>
```

## API Reference

### `Select.Root`

The root container that manages the select state and context.

| Prop           | Type                                          | Default | Description                                                             |
| -------------- | --------------------------------------------- | ------- | ----------------------------------------------------------------------- |
| `options`      | `SelectOption[]`                              |         | Data array for the selectable options                                   |
| `multiple`     | `boolean`                                     | `false` | Whether multiple options can be selected                                |
| `searchable`   | `boolean`                                     | `true`  | Allows filtering options through a search input                         |
| `virtualized`  | `boolean`                                     | `true`  | Enables virtualized rendering for performance with large options arrays |
| `disabled`     | `boolean`                                     | `false` | Disables the select component entirely                                  |
| `value`        | `string \| number \| Array<string \| number>` |         | Controlled selected value                                               |
| `defaultValue` | `string \| number \| Array<string \| number>` |         | Initialize with a specific uncontrolled value                           |
| `name`         | `string`                                      |         | Input name, convenient for forms                                        |
| `onChange`     | `(option: SelectOption) => void`              |         | Triggered whenever an option is selected or deselected                  |

_Also accepts `HTMLAttributes<HTMLDivElement>`_ (ignoring `children`, `onChange`, `defaultValue`).

### `Select.Trigger`

The button element that toggles the dropdown overlay. Usually wraps both `Select.Value` and `Select.Icon`.

_Accepts `ButtonHTMLAttributes<HTMLButtonElement>`_

### `Select.Value`

Displays the currently selected value(s) or a placeholder.

| Prop                  | Type                                  | Default | Description                                                           |
| --------------------- | ------------------------------------- | ------- | --------------------------------------------------------------------- |
| `placeholder`         | `string`                              |         | Displayed when there is no selected value                             |
| `renderLabel`         | `(option: SelectOption) => ReactNode` |         | Custom render function for the primary selected label (Single Select) |
| `renderMultiValueTag` | `(option, props) => ReactNode`        |         | Custom render function for selected tag badges (Multiple Select)      |

### `Select.Icon`

An optional chevron or carets icon to provide visual feedback for the dropdown status.

| Prop   | Type     | Default | Description               |
| ------ | -------- | ------- | ------------------------- |
| `size` | `number` | `16`    | Sizing scale for the icon |

### `Select.Portal`

Mounts the wrapped `Select.Dropdown` into a different DOM element.

| Prop        | Type                     | Default         | Description                        |
| ----------- | ------------------------ | --------------- | ---------------------------------- |
| `container` | `RefObject<HTMLElement>` | `document.body` | Ref object to append the portal to |

### `Select.Dropdown`

The content container listing the selectable options or virtualizer rows.

| Prop           | Type                                  | Default    | Description                                                              |
| -------------- | ------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| `children`     | `(option: SelectOption) => ReactNode` |            | A render-prop callback that maps each option to an element               |
| `estimateSize` | `(index: number) => number`           | `() => 40` | Estimated height/width of options used for virtualization calculations   |
| `scrollAlign`  | `"start" \| "center" \| "end"`        | `"center"` | Determines how the selected item will be scrolled to when dropdown opens |

### `Select.Item`

An individually selectable item element inside the dropdown context.

| Prop    | Type               | Default | Description                                                       |
| ------- | ------------------ | ------- | ----------------------------------------------------------------- |
| `value` | `string \| number` |         | Must correspond to the associated `SelectOption` value identifier |

_Also accepts `HTMLAttributes<HTMLDivElement>`_

---
