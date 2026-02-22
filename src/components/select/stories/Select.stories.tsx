import { useCallback, useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuCircleX } from "react-icons/lu";

import { Select } from "../index";
import type {
  SelectDropdownProps,
  SelectOption,
  SelectRootProps,
} from "../types";

const meta = {
  title: "Components/Select",
} satisfies Meta;

export default meta;

type Story = StoryObj<
  SelectRootProps & Pick<SelectDropdownProps, "scrollAlign">
>;

export const Default: Story = {
  argTypes: {
    scrollAlign: {
      control: "radio",
      options: ["start", "center", "end"],
    },
  },
  args: {
    multiple: false,
    searchable: false,
    virtualized: true,
    disabled: false,
    scrollAlign: "center",
    options: Array.from({ length: 100 }).map((_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
  },
  render: ({ scrollAlign, ...args }) => (
    <Select.Root {...args}>
      <Select.Trigger>
        <Select.Value placeholder="Select Option" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Dropdown scrollAlign={scrollAlign}>
        {({ label, value }) => (
          <Select.Item key={value} value={value}>
            {label}
          </Select.Item>
        )}
      </Select.Dropdown>
    </Select.Root>
  ),
};

export const Controlled: Story = {
  args: {
    multiple: false,
    defaultValue: "option-99",
    virtualized: true,
    disabled: false,
    options: Array.from({ length: 100 }).map((_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
  },
  render: (args) => {
    const [value, setValue] = useState<SelectRootProps["value"]>(
      args.defaultValue,
    );
    const prevMultipleRef = useRef(args.multiple);

    const onChange = useCallback(
      (option: SelectOption) => {
        setValue((prev = "") => {
          if (args.multiple) {
            const prevValue = Array.isArray(prev) ? prev : [prev];
            const isPrevSelectedValue = prevValue.some(
              (v) => option.value === v,
            );

            return isPrevSelectedValue
              ? prevValue.filter(Boolean).filter((v) => v !== option.value)
              : [...prevValue.filter(Boolean), option.value];
          }

          return option.value;
        });
      },
      [args.multiple],
    );

    useEffect(() => {
      if (prevMultipleRef.current != args.multiple) {
        setValue(undefined);
        prevMultipleRef.current = args.multiple;
      }
    }, [args.multiple]);

    return (
      <div className="flex flex-col">
        <Select.Root value={value} onChange={onChange} {...args}>
          <Select.Trigger>
            <Select.Value placeholder="Select pokemon" />
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

        <div className="flex flex-col mt-4">
          <label className="mb-1">Controlled Value:</label>
          <pre>
            <code>{Array.isArray(value) ? value.join(", ") : value}</code>
          </pre>
        </div>
      </div>
    );
  },
};

export const CustomOptionAndLabel: Story = {
  args: {
    multiple: false,
    searchable: false,
    virtualized: true,
    disabled: false,
  },
  render: (args) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
      fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1000").then(
        async (res) => {
          const { results } = await res.json();

          setOptions(
            results.map(({ name }: { name: string }, i: number) => ({
              value: name,
              label: name,
              src: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(i + 1).padStart(3, "0")}.png`,
            })),
          );
        },
      );
    }, []);

    return (
      <Select.Root {...args} options={options}>
        <Select.Trigger>
          <Select.Value<{ src: string }>
            renderLabel={({ value, label, src }) => (
              <div key={value} className="flex items-center gap-2.5">
                <span className="flex w-5 h-5">
                  <img src={src} />
                </span>
                <span className="capitalize">{label}</span>
              </div>
            )}
            renderMultiValueTag={(option, props) => (
              <div
                key={option.value}
                className="flex items-center gap-2.5 bg-gray-100 px-1.5 py-1"
                {...props.getTagRootProps()}
              >
                <span className="flex w-5 h-5">
                  <img src={option.src} />
                </span>
                <span className="capitalize">{option.label}</span>
                <button
                  {...props.getTagDeleteButtonProps({
                    onClick: () => props.onDeleteValue(option),
                  })}
                >
                  <LuCircleX />
                </button>
              </div>
            )}
            placeholder="Select pokemon"
          />
          <Select.Icon />
        </Select.Trigger>
        <Select.Dropdown<{ src: string }>>
          {({ label, value, src }) => (
            <Select.Item key={value} value={value} className="gap-2.5">
              <span className="flex w-5 h-5">
                <img src={src} />
              </span>
              <span className="capitalize">{label}</span>
            </Select.Item>
          )}
        </Select.Dropdown>
      </Select.Root>
    );
  },
};

export const WithPortal: Story = {
  args: {
    options: Array.from({ length: 100 }).map((_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
  },
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger>
        <Select.Value placeholder="Select pokemon" />
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
  ),
};
