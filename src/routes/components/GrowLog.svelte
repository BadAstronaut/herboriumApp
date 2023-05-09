<script lang="ts">
    //import {Herb} from '$lib/herbObject';
    import { writable, get} from "svelte/store";
    // @ts-ignore
    import { herbStore, selectedHerbKey } from "/src/stores/herbStore.ts";
    import { onMount } from "svelte";
    import {
        createSvelteTable,
        flexRender,
        getCoreRowModel,
    } from "@tanstack/svelte-table";
    import type {
        ColumnDef,
        TableOptions,
    } from "@tanstack/table-core/src/types";
    import type { SvelteComponent } from "svelte";
    //import type { SvelteComponentTyped } from 'svelte';
    //subscribes to the herbStore
    let herbs: any;
    let table: any;
    let selectedRow:any = null;
    //implement on mount
    onMount(async () => {
        herbStore.subscribe((value: any) => {
            herbs = value;
            //console.log(herbs,'herbs');
        });

        const options = writable<TableOptions<Herb>>({
            data: herbs.herbs,
            columns: defaultColumns,
            getCoreRowModel: getCoreRowModel(),
            enableRowSelection: true, //enable row selection for all rows
            // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
            onRowSelectionChange: setRowSelection,
            debugTable: true,
        });
        table = createSvelteTable(options);
        selectedHerbKey.subscribe((value: any) => {
            //table.setRowSelection(value);
            //get the index of the herbs using the value as a key 
            let herbKeyIndex = herbs.herbs.findIndex((herb: any) => herb.herb_name === value);
            const tableObject = get(table);
            if (herbKeyIndex > -1) {
                const row = tableObject.getRow(herbKeyIndex.toString())
                setRowSelection(row)
            }
            
            //console.log(herbKeyIndex, "selected herb key........");
            //tableObject.setRowSelection('1', true);
        });
    });

    

    type Herb = {
        herb_name: string;
        planted_date: string;
        planned_harvest_date: string;
    };

    const defaultColumns: ColumnDef<Herb>[] = [
        {
            accessorKey: "herb_name",
            cell: (info) => info.getValue(),
            header:"Herb Name"
            //footer: info => info.column.id,
        },
        {
            accessorKey: "planted_date",
            cell: (info) => info.getValue(),
            header:"Planted Date"
            //footer: info => info.column.id,
        },
        {
            accessorKey: "planned_harvest_date",
            cell: (info) => info.getValue(),
            header:"Planned Harvest Date"
            //footer: info => info.column.id,
        },
    ];
    //create a function to set the id of the selected row
    function setRowSelection(row: any) {
        selectedRow = row;
        let currentSelected  = get(selectedHerbKey);
        //conver string to in 
        let herbKeyIndex = parseInt(row.id);
        if (currentSelected != herbs.herbs[herbKeyIndex].herb_name){
            //console.log(herbs.herbs[herbKeyIndex].herb_name, "herb name"
            selectedHerbKey.set(herbs.herbs[herbKeyIndex].herb_name);
        }
        //console.log(row, "row selection changed");
    }


</script>

{#if herbs}
    <table>
        <thead>
            {#each $table.getHeaderGroups() as headerGroup}
                <tr>
                    {#each headerGroup.headers as header}
                        <th>
                            {#if !header.isPlaceholder}
                                <!-- fix the typescript syntax error below -->
                                
                                <svelte:component
                                    this={flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                />
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/each}
        </thead>
        <tbody>
            {#each $table.getRowModel().rows as row}
                <tr
                    data-row-id={row.id}
                    class:selected={selectedRow === row}
                    on:click={() => setRowSelection(row)}
                >
                    {#each row.getVisibleCells() as cell}
                        <td>
                            <svelte:component
                                this={flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            />
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
        <tfoot>
            {#each $table.getFooterGroups() as footerGroup}
                <tr>
                    {#each footerGroup.headers as header}
                        <th>
                            {#if !header.isPlaceholder}
                                <svelte:component
                                    this={flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                                />
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/each}
        </tfoot>
    </table>
{:else}
    <h1>Grow Log</h1>
{/if}

<style>
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 03;
    }
    .selected {
        background-color: lightgoldenrodyellow;
    }
    tr:hover {
        cursor: pointer;
    }
</style>
