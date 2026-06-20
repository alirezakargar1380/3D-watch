'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetProducts } from 'src/api/product';
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
    getComparator,
    TableSkeleton,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import { IProductItem, IProductTableFilters, IProductTableFilterValue } from 'src/types/product';

import admin_axios, { endpoints } from 'src/utils/axios';
import PositionTableRow from '../position-table-row';
import { useGetPositions } from 'src/api/position';
import { IPosition } from 'src/types/position';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Position Name', width: 220 },
    { id: 'createdAt', label: 'Create at', width: 160 },
    { id: '', width: 88 },
];

const PUBLISH_OPTIONS = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
];

const defaultFilters: IProductTableFilters = {
    name: '',
    publish: [],
    stock: [],
};

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Minimal: The starting point for your next project',
};

export default function ProductPositionListView() {
    const router = useRouter();

    const table = useTable();

    const settings = useSettingsContext();

    const [tableData, setTableData] = useState<IPosition[]>([]);

    const [filters, setFilters] = useState(defaultFilters);

    const { positions,positionsEmpty, positionsLoading } = useGetPositions();

    useEffect(() => {
        if (positions.length) {
            setTableData(positions);
        }
    }, [positions]);

    const denseHeight = table.dense ? 60 : 80;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!positions.length && canReset) || positionsEmpty;

    const handleDeleteRow = useCallback(
        async (id: number) => {
            await admin_axios.delete(endpoints.product.delete(id))
            const deleteRow = tableData.filter((row) => row.id !== id);
            setTableData(deleteRow);

            //   table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [table, tableData]
    );

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.productPosition.edit(id));
        },
        [router]
    );

    const handleViewRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.product.details(id));
        },
        [router]
    );

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        {
                            name: 'Product',
                            href: paths.dashboard.productPosition.root,
                        },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.productPosition.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            New Position
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card>

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                />

                                <TableBody>
                                    {positionsLoading ? (
                                        [...Array(table.rowsPerPage)].map((i, index) => (
                                            <TableSkeleton key={index} sx={{ height: denseHeight }} />
                                        ))
                                    ) : (
                                        <>
                                            {tableData.map((row) => (
                                                <PositionTableRow
                                                    key={row.id}
                                                    row={row}
                                                    onSelectRow={() => table.onSelectRow(row.id)}
                                                    onDeleteRow={() => handleDeleteRow(row.id)}
                                                    onEditRow={() => handleEditRow(row.id)}
                                                    onViewRow={() => handleViewRow(row.id)}
                                                />
                                            ))}
                                        </>
                                    )}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                </Card>
            </Container>
        </>
    );
}