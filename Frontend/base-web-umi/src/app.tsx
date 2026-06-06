import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { LogoutOutlined } from '@ant-design/icons'; // 🌟 Import icon Đăng xuất
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
// import LoadingPage from './components/Loading';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';

/** loading */
export const initialStateConfig = {
    loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * // Tobe removed
 * */
export async function getInitialState(): Promise<IInitialState> {
    return {
        permissionLoading: true,
    };
}

// Tobe removed
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
    errorHandler: (error: ResponseError) => {
        const { messages } = getIntl(getLocale());
        const { response } = error;

        if (response && response.status) {
            const { status, statusText, url } = response;
            const requestErrorMessage = messages['app.request.error'];
            const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
            const errorDescription = messages[`app.request.${status}`] || statusText;
            notification.error({
                message: errorMessage,
                description: errorDescription,
            });
        }

        if (!response) {
            notification.error({
                description: 'Yêu cầu gặp lỗi',
                message: 'Bạn hãy thử lại sau',
            });
        }
        throw error;
    },
    requestInterceptors: [authHeaderInterceptor],
};

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
    return {
        unAccessible: (
            <OIDCBounder>
                <TechnicalSupportBounder>
                    <NotAccessible />
                </TechnicalSupportBounder>
            </OIDCBounder>
        ),
        noFound: <NotFoundContent />,
        disableContentMargin: false,
        footerRender: () => <Footer />,

        rightContentRender: () => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '16px' }}>
                <RightContent />
                <div 
                    className="header-logout-minimal"
                    title="Đăng xuất" // Hiện chữ "Đăng xuất" nhỏ khi di chuột vào icon
                    onClick={async () => {
                        // 1. Xóa dữ liệu phiên làm việc
                        localStorage.removeItem('token');
                        sessionStorage.clear();

                        // 2. Reset trạng thái hệ thống
                        if (setInitialState) {
                            await setInitialState((s) => ({
                                ...s,
                                currentUser: undefined,
                                authorizedPermissions: undefined,
                            }));
                        }
                        
                        // 3. Chuyển hướng về trang Login
                        notification.success({ message: 'Đăng xuất thành công!' });
                        history.replace('/login');
                    }}
                >
                    <LogoutOutlined />
                </div>
            </div>
        ),

        onPageChange: () => {
            if (initialState?.currentUser) {
                const { location } = history;
                const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));

                if (location.pathname === '/') {
                    history.replace('/dashboard');
                } else if (
                    !isUncheckPath &&
                    currentRole &&
                    initialState?.authorizedPermissions?.length &&
                    !initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
                )
                    history.replace('/403');
            }
        },

        menuItemRender: (item: any, dom: any) => {
            return (
                <a
                    className='not-underline custom-menu-item-link'
                    key={item?.path}
                    href={item?.path}
                    onClick={(e) => {
                        e.preventDefault();
                        history.push(item?.path ?? '/');
                    }}
                >
                    {dom}
                </a>
            );
        },

        // Xóa hoàn toàn mảng links cũ ở sidebar nếu có
        links: [],

        // Khóa chiều rộng khi thu gọn về 48px chuẩn
        collapsedWidth: 48,

        childrenRender: (dom) => (
            <OIDCBounder>
                <ErrorBoundary>
                    {/* <TechnicalSupportBounder> */}
                    <OneSignalBounder>{dom}</OneSignalBounder>
                    {/* </TechnicalSupportBounder> */}
                </ErrorBoundary>
            </OIDCBounder>
        ),
        menuHeaderRender: undefined,
        ...initialState?.settings,
    };
};