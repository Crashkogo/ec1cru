import { Toolbar, SaveButton, Button } from 'react-admin';
import type { ToolbarProps } from 'react-admin';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const buttonSx = { minWidth: 120, py: 1.5 };

const UserFormToolbar = (props: ToolbarProps) => {
    const navigate = useNavigate();
    return (
        <Toolbar {...props}>
            <SaveButton size="large" sx={buttonSx} />
            <Button
                label="Назад"
                onClick={() => navigate('/admin/users')}
                startIcon={<ArrowBackIcon />}
                variant="contained"
                color="primary"
                size="large"
                sx={{ ml: 2, ...buttonSx }}
            />
        </Toolbar>
    );
};

export default UserFormToolbar;